package za.co.protogen.AuthorizationServerConfig;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;


@SpringBootApplication
@EnableWebSecurity
public class AuthorizationServerConfigApplication {

	public static void main(String[] args) {
		SpringApplication.run(AuthorizationServerConfigApplication.class, args);
	}

}

