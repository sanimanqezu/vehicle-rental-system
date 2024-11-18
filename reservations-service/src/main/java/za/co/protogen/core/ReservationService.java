package za.co.protogen.core;

import za.co.protogen.domain.ReservationDTO;

import java.time.LocalDate;
import java.util.List;

public interface ReservationService {

    void addReservation(ReservationDTO reservationDTO);

    void removeReservation(Long id);

    ReservationDTO getReservationById(Long id);

    List<ReservationDTO> getAllReservations();

    void updateReservation(ReservationDTO updatedReservation);

    List<ReservationDTO> searchReservations(Long id, Long userId, Long carId, LocalDate fromDate, LocalDate toDate, String pickUpLocation, String dropOffLocation);
}
