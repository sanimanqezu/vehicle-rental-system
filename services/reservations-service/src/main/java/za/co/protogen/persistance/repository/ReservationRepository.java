package za.co.protogen.persistance.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.co.protogen.persistance.Reservation;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long>{

    List<Reservation> findByUserId(Long userId);

    List<Reservation> findByCarId(String carId);

    List<Reservation> findByFromDate(LocalDate fromDate);

    List<Reservation> findByToDate(LocalDate toDate);

    List<Reservation> findByPickUpLocation(String pickUpLocation);

    List<Reservation> findByDropOffLocation(String dropOffLocation);
}
