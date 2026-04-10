package za.co.protogen.adapter;

import org.mapstruct.Mapper;
import org.mapstruct.NullValuePropertyMappingStrategy;
import java.util.List;
import org.mapstruct.factory.Mappers;
import za.co.protogen.persistance.Reservation;
import za.co.protogen.reservationsService.models.ReservationDTO;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ReservationMapper {

    ReservationMapper RESERVATION_MAPPER = Mappers.getMapper(ReservationMapper.class);

    ReservationDTO reservationToReservationDTO(Reservation reservation);

    Reservation reservationDTOToReservation(ReservationDTO reservationDTO);

    List<Reservation> reservationDTOsToReservations(List<ReservationDTO> reservationDTOS);

    List<ReservationDTO> reservationsToReservationDTOs(List<Reservation> reservations);

}

