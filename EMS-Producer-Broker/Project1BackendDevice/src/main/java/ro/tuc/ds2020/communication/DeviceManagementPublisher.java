package ro.tuc.ds2020.communication;

import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.Channel;

public class DeviceManagementPublisher {
    private static final String EXCHANGE_NAME = "device_events_exchange";

    public void publishDeviceEvent(String eventType, String deviceId) {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("rabbitmq");
        factory.setPort(5672);
        factory.setUsername("admin"); // Set username
        factory.setPassword("admin"); // Set password

        try (Connection connection = factory.newConnection();
             Channel channel = connection.createChannel()) {

            // Declare a topic exchange
            channel.exchangeDeclare(EXCHANGE_NAME, "topic");

            // Message content
            String message = String.format("{\"event\":\"%s\",\"device_id\":\"%s\"}", eventType, deviceId);

            // Publish the message with a routing key
            String routingKey = "device." + eventType; // e.g., device.created
            channel.basicPublish(EXCHANGE_NAME, routingKey, null, message.getBytes("UTF-8"));

            System.out.println(" [x] Sent '" + routingKey + "':'" + message + "'");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
