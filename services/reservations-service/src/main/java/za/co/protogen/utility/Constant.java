package za.co.protogen.utility;

import za.co.protogen.domain.Reservation;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
public class Constant {
    public static List<Reservation> reservations = new ArrayList<>();
    static {
        // Add mock data
        Reservation reservation1 = new Reservation();
        reservation1.setId(1L);
        reservation1.setUserId(1L);
        reservation1.setCarId(1L);
        reservation1.setFromDate(LocalDate.of(2023, 6, 10));
        reservation1.setToDate(LocalDate.of(2023, 6, 15));
        reservation1.setPickUpLocation("New York");
        reservation1.setDropOffLocation("Los Angeles");
        reservations.add(reservation1);
        Reservation reservation2 = new Reservation();
        reservation2.setId(2L);
        reservation2.setUserId(2L);
        reservation2.setCarId(2L);
        reservation2.setFromDate(LocalDate.of(2023, 6, 12));
        reservation2.setToDate(LocalDate.of(2023, 6, 18));
        reservation2.setPickUpLocation("London");
        reservation2.setDropOffLocation("Paris");
        reservations.add(reservation2);
        // Add more reservations as needed
    }
}
