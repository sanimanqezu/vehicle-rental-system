package za.co.protogen.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import static za.co.protogen.utility.Constant.reservations;

import za.co.protogen.adapter.ReservationMapper;
import za.co.protogen.persistance.repository.ReservationRepository;

@Configuration
public class ApplicationProperties {

    @Bean
    CommandLineRunner commandLineRunner(ReservationRepository reservationRepository) {
        return (args -> reservationRepository.saveAll(ReservationMapper.RESERVATION_MAPPER.reservationDTOsToReservations(reservations)));
    }
}