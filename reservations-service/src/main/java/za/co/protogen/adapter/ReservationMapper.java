package za.co.protogen.adapter;

import org.mapstruct.Mapper;
import org.mapstruct.NullValuePropertyMappingStrategy;
import java.util.List;

import org.mapstruct.factory.Mappers;
import za.co.protogen.domain.ReservationDTO;
import za.co.protogen.persistance.Reservation;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ReservationMapper {

    ReservationMapper RESERVATION_MAPPER = Mappers.getMapper(ReservationMapper.class);

    ReservationDTO reservationToReservationDTO(Reservation reservation);

    Reservation reservationDTOToReservation(ReservationDTO reservationDTO);

    List<ReservationDTO> reservationsToReservationDTOs(List<Reservation> reservations);

    List<Reservation> reservationDTOsToReservations(List<ReservationDTO> reservationDTOs);
}
