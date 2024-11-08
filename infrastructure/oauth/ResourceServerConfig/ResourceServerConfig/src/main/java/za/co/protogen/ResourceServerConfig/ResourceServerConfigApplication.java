package za.co.protogen.ResourceServerConfig;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableResourceServer
@SpringBootApplication
public class ResourceServerConfigApplication {

	public static void main(String[] args) {
		SpringApplication.run(ResourceServerConfigApplication.class, args);
	}

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeRequests(authorizeRequests ->
                authorizeRequests
                    .antMatchers("/public/**").permitAll()
                    .anyRequest().authenticated()     
            )
            .oauth2ResourceServer().jwt();
        return http.build();
    }

}
