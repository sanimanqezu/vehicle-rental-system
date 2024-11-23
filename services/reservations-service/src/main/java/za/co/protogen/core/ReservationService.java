package za.co.protogen.core;

import za.co.protogen.persistance.Reservation;

import java.time.LocalDate;
import java.util.List;

public interface ReservationService {

    void addReservation(Reservation reservation);

    void removeReservation(Long id);

    Reservation getReservationById(Long id);

    List<Reservation> getAllReservations();

    void updateReservation(Long id ,Reservation updatedReservation);

    List<Reservation> searchReservations(Long id, Long userId, Long carId, LocalDate fromDate, LocalDate toDate, String pickUpLocation, String dropOffLocation);
}
