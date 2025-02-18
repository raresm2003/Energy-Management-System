package ro.tuc.ds2020;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.validation.annotation.Validated;
import ro.tuc.ds2020.communication.DeviceManagementPublisher;
import ro.tuc.ds2020.dtos.DeviceDTO;
import ro.tuc.ds2020.services.DeviceService;

import java.util.List;
import java.util.TimeZone;

@SpringBootApplication
@Validated
public class Ds2020Application extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(Ds2020Application.class);
    }

    public static void main(String[] args) {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));

        DeviceManagementPublisher publisher = new DeviceManagementPublisher();
        System.out.println("before event");
        // Simulate events
        publisher.publishDeviceEvent("created", "11111111-1111-1111-1111-111111111111");
        publisher.publishDeviceEvent("updated", "11111111-1111-1111-1111-111111111111");
        publisher.publishDeviceEvent("deleted", "11111111-1111-1111-1111-111111111111");
        System.out.println("after event");

        SpringApplication.run(Ds2020Application.class, args);
    }

    @Bean
    public CommandLineRunner commandLineRunner(DeviceService deviceService) {
        return args -> {
            List<DeviceDTO> devices = deviceService.findDevices();
            devices.forEach(device -> System.out.println(device.toString()));
        };
    }
}
