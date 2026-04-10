package za.co.protogen.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Reservation {

    private Long id;
    private Long userId;
    private String carId;
    private LocalDate fromDate;
    private LocalDate toDate;
    private String pickUpLocation;
    private String dropOffLocation;
}
