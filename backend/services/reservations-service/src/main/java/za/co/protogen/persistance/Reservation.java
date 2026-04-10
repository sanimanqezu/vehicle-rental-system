package za.co.protogen.persistance;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Entity
@Table(name = "reservation")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Reservation {

    @Id
    @Column(name = "id")
    private Long id;
    @Column(name = "userId")
    private Long userId;
    @Column(name = "CarId")
    private String carId;
    @Column(name = "fromDate")
    private LocalDate fromDate;
    @Column(name = "toDate")
    private LocalDate toDate;
    @Column(name = "pickUpLOcation")
    private String pickUpLocation;
    @Column(name = "dropOffLocation")
    private String dropOffLocation;
}
