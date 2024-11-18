package za.co.protogen.persistance;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDate;

@Entity
@Table(name = "reservation")
public class Reservation {

    @Id
    @Column(name = "id")
    private Long id;
    @Column(name = "userId")
    private Long userId;
    @Column(name = "CarId")
    private Long carId;
    @Column(name = "fromDate")
    private LocalDate fromDate;
    @Column(name = "toDate")
    private LocalDate toDate;
    @Column(name = "pickUpLOcation")
    private String pickUpLocation;
    @Column(name = "dropOffLocation")
    private String dropOffLocation;

    public Reservation() {
    }

    public Reservation(Long id, Long userId, Long carId, LocalDate fromDate, LocalDate toDate, String pickUpLocation, String dropOffLocation) {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getCarId() {
        return carId;
    }

    public void setCarId(Long carId) {
        this.carId = carId;
    }

    public LocalDate getFromDate() {
        return fromDate;
    }

    public void setFromDate(LocalDate fromDate) {
        this.fromDate = fromDate;
    }

    public LocalDate getToDate() {
        return toDate;
    }

    public void setToDate(LocalDate toDate) {
        this.toDate = toDate;
    }

    public String getPickUpLocation() {
        return pickUpLocation;
    }

    public void setPickUpLocation(String pickUpLocation) {
        this.pickUpLocation = pickUpLocation;
    }

    public String getDropOffLocation() {
        return dropOffLocation;
    }

    public void setDropOffLocation(String dropOffLocation) {
        this.dropOffLocation = dropOffLocation;
    }

    @Override
    public String toString() {
        return "Reservation{"
                + "id=" + id
                + ", userId='" + userId + '\''
                + ", carId='" + carId + '\''
                + ", fromDate='" + fromDate + '\''
                + ", toDate='" + toDate + '\''
                + ", pickUpLocation='" + pickUpLocation + '\''
                + ", dropOffLocation='" + dropOffLocation + '\''
                + '}';

    }
}
