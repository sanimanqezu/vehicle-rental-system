package za.co.protogen.AuthorizationServerConfig;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.Customizer;


@SpringBootApplication
@EnableWebSecurity
@EnableDiscoveryClient
public class AuthorizationServerConfigApplication {

	public static void main(String[] args) {
		SpringApplication.run(AuthorizationServerConfigApplication.class, args);
	}

	@Bean
	public SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
		http
				.csrf(csrf -> csrf.disable())
				.authorizeHttpRequests(auth -> auth
						.anyRequest().authenticated()
				)
				.formLogin(Customizer.withDefaults());
		return http.build();
	}

	@Bean
	public InMemoryUserDetailsManager inMemoryUserDetailsManager(PasswordEncoder passwordEncoder) {
		var user1 = User.builder()
				.username("admin")
				.password(passwordEncoder.encode("password1"))
				.roles("ADMIN")
				.build();

		var user2 = User.builder()
				.username("user")
				.password(passwordEncoder.encode("password2"))
				.roles("USER")
				.build();

		return new InMemoryUserDetailsManager(user1, user2);
	}
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

}
