package ro.tuc.ds2020;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.validation.annotation.Validated;
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
