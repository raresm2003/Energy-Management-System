package ro.tuc.ds2020;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.validation.annotation.Validated;
import com.rabbitmq.client.*;
import ro.tuc.ds2020.entities.Message;
import ro.tuc.ds2020.repositories.MessageRepository;
import ro.tuc.ds2020.services.MessageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import java.util.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@SpringBootApplication
@Validated
public class Ds2020Application extends SpringBootServletInitializer {

    private static final String QUEUE_NAME = "device_data_queue";
    private static final String TOPIC_EXCHANGE_NAME = "device_events_exchange";
    private static final String TOPIC_QUEUE_NAME = "device_events_queue";

    // Store the messages per user (only keep the last 10)
    private final Map<UUID, Queue<Message>> userMessages = new HashMap<>();

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private MessageService messageService;

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(Ds2020Application.class);
    }

    public static void main(String[] args) {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
        ApplicationContext context = SpringApplication.run(Ds2020Application.class, args);

        // After Spring Boot has started, get the application instance from the context
        Ds2020Application app = context.getBean(Ds2020Application.class);

        // Start both message receivers in separate threads
        ExecutorService executorService = Executors.newFixedThreadPool(2);
        executorService.submit(app::receiveMessages);
        executorService.submit(app::receiveTopicMessages);
    }

    public void receiveMessages() {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("rabbitmq");
        factory.setPort(5672);
        factory.setUsername("admin"); // Set username
        factory.setPassword("admin"); // Set password

        try (Connection connection = factory.newConnection();
             Channel channel = connection.createChannel()) {

            channel.queueDeclare(QUEUE_NAME, true, false, false, null);

            System.out.println("Waiting for measurement messages. To exit press CTRL+C");

            DeliverCallback deliverCallback = (consumerTag, delivery) -> {
                String message = new String(delivery.getBody(), "UTF-8");
                System.out.println("Received measurement message: " + message);

                // Parse the message using Gson
                JsonObject jsonMessage = JsonParser.parseString(message).getAsJsonObject();
                long timestamp = jsonMessage.get("timestamp").getAsLong();
                UUID deviceId = UUID.fromString(jsonMessage.get("device_id").getAsString());
                float measurementValue = jsonMessage.get("measurement_value").getAsFloat();

                // Add the message with timestamp to the user's list
                addMessageForUser(deviceId, measurementValue, timestamp);

                // Check if the user has 10 messages
                if (userMessages.get(deviceId).size() == 10) {
                    // Calculate the sum of the last 10 entries
                    float sum = calculateSum(deviceId);

                    // Store the sum in the database, with the timestamp of the last entry
                    storeSumInDatabase(deviceId, sum, timestamp);

                    // Reset the user's messages after storing the sum
                    resetMessagesForUser(deviceId);
                }
            };

            channel.basicConsume(QUEUE_NAME, true, deliverCallback, consumerTag -> {});

            synchronized (Ds2020Application.class) {
                Ds2020Application.class.wait();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void receiveTopicMessages() {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("rabbitmq");
        factory.setPort(5672);
        factory.setUsername("admin"); // Set username
        factory.setPassword("admin"); // Set password

        try (Connection connection = factory.newConnection();
             Channel channel = connection.createChannel()) {

            // Declare a topic exchange
            channel.exchangeDeclare(TOPIC_EXCHANGE_NAME, "topic");

            // Declare a queue for topic messages
            channel.queueDeclare(TOPIC_QUEUE_NAME, true, false, false, null);

            // Bind the queue to the exchange with a wildcard routing key
            channel.queueBind(TOPIC_QUEUE_NAME, TOPIC_EXCHANGE_NAME, "device.*");

            System.out.println("Waiting for device event messages. To exit press CTRL+C");

            DeliverCallback deliverCallback = (consumerTag, delivery) -> {
                String message = new String(delivery.getBody(), "UTF-8");
                String routingKey = delivery.getEnvelope().getRoutingKey();

                System.out.println("Received event message: [Routing Key: " + routingKey + "] " + message);
            };

            channel.basicConsume(TOPIC_QUEUE_NAME, true, deliverCallback, consumerTag -> {});

            synchronized (Ds2020Application.class) {
                Ds2020Application.class.wait();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void addMessageForUser(UUID userId, float measurementValue, long timestamp) {
        Queue<Message> messages = userMessages.computeIfAbsent(userId, k -> new LinkedList<>());

        // If there are already 10 entries, remove the oldest one
        if (messages.size() == 10) {
            messages.poll();  // Remove the oldest message to maintain the last 10
        }

        // Create a new message and add it to the queue
        Message message = new Message(userId, timestamp, measurementValue);
        messages.offer(message);
    }

    private float calculateSum(UUID userId) {
        Queue<Message> messages = userMessages.get(userId);

        if (messages == null || messages.isEmpty()) {
            return 0;
        }

        // Calculate sum of the last 10 entries
        return (float) messages.stream().mapToDouble(Message::getMeasurementValue).sum();
    }

    private void storeSumInDatabase(UUID userId, float sum, long timestamp) {
        // Store the sum with the timestamp of the last value
        Message sumMessage = new Message(userId, timestamp, sum);
        messageRepository.save(sumMessage);
        System.out.println("Stored sum for user " + userId + " with timestamp " + timestamp + ": " + sum);
    }

    private void resetMessagesForUser(UUID userId) {
        // Reset the user's message queue after storing the sum
        userMessages.put(userId, new LinkedList<>());
        System.out.println("Reset messages for user " + userId);
    }
}
