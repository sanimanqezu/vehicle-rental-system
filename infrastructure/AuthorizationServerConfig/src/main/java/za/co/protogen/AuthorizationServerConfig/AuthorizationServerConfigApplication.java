package za.co.protogen.AuthorizationServerConfig;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;

@SpringBootApplication
@EnableWebSecurity
public class AuthorizationServerConfigApplication {

	public static void main(String[] args) {
		SpringApplication.run(AuthorizationServerConfigApplication.class, args);
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return PasswordEncoderFactories.createDelegatingPasswordEncoder();
	}

	@Bean
	public InMemoryUserDetailsManager inMemoryUserDetailsManager(PasswordEncoder passwordEncoder) {
		var user1 = User.builder()
				.username("user1")
				.password(passwordEncoder.encode("password1"))
				.roles("ADMIN")
				.build();

		var user2 = User.builder()
				.username("user2")
				.password(passwordEncoder.encode("password2"))
				.roles("USER")
				.build();

		return new InMemoryUserDetailsManager(user1, user2);
	}
}


