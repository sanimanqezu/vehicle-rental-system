package za.co.protogen;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;


@SpringBootApplication
@EnableDiscoveryClient
public class CarsServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(CarsServiceApplication.class, args);
	}

}
