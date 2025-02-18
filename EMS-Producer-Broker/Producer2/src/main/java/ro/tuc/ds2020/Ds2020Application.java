package ro.tuc.ds2020;

import com.rabbitmq.client.*;

import java.io.BufferedReader;
import java.io.FileReader;

public class Ds2020Application {

    private static final String QUEUE_NAME = "device_data_queue";
    private static final String FILE_PATH = "sensor.csv";

    public static void main(String[] args) {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");
        factory.setUsername("admin"); // Set username
        factory.setPassword("admin"); // Set password

        try (Connection connection = factory.newConnection();
             Channel channel = connection.createChannel()) {

            channel.queueDeclare(QUEUE_NAME, true, false, false, null);

            System.out.println("Connected to RabbitMQ");

            BufferedReader reader = new BufferedReader(new FileReader(FILE_PATH));
            String line;
            long timestamp = System.currentTimeMillis();

            while ((line = reader.readLine()) != null) {
                String[] values = line.split(",");
                float measurementValue = Float.parseFloat(values[0].trim());

                String deviceId = "22222222-2222-2222-2222-222222222222";

                String message = String.format(
                        "{\"timestamp\": %d, \"device_id\": \"%s\", \"measurement_value\": %f}",
                        timestamp, deviceId, measurementValue
                );

                channel.basicPublish("", QUEUE_NAME, null, message.getBytes());
                System.out.println("Sent: " + message);

                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }

                timestamp = System.currentTimeMillis();
            }

            reader.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
