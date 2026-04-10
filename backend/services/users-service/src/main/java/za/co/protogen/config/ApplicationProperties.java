package za.co.protogen.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import za.co.protogen.adapter.UserMapper;
import za.co.protogen.persistance.repository.UserRepository;
import static za.co.protogen.utility.Constant.users;

@Configuration
public class ApplicationProperties {

    @Bean
    CommandLineRunner commandLineRunner(UserRepository userRepository) {
        return (args -> userRepository.saveAll(UserMapper.USER_MAPPER.userDTOsToUsers(users)));
    }
}
