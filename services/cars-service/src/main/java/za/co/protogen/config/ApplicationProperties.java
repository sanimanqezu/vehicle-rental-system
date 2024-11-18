package za.co.protogen.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import za.co.protogen.adapter.CarMapper;
import za.co.protogen.persistance.repository.CarRepository;
import static za.co.protogen.utility.Constant.cars;

@Configuration
public class ApplicationProperties {

    @Bean
    CommandLineRunner commandLineRunner(CarRepository carRepository) {
        return (args -> carRepository.saveAll(CarMapper.CAR_MAPPER.carDTOsToCars(cars)));
    }
}
