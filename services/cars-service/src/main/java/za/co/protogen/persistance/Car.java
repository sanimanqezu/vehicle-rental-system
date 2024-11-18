package za.co.protogen.persistance;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Cars")
public class Car {

    @Id
    @Column(name = "id")
    private Long id;
    @Column(name = "make")
    private String make;
    @Column(name = "model")
    private String model;
    @Column(name = "year")
    private int year;
    @Column(name = "color")
    private String color;
    @Column(name = "engine")
    private String engine;
    @Column(name = "transmission")
    private String transmission;
    @Column(name = "fuelType")
    private String fuelType;
    @Column(name = "mileage")
    private int mileage;
    @Column(name = "vin")
    private String vin;
    @Column(name = "price")
    private int price;
    @Column(name = "ownerId")
    private int ownerId;
    @Column(name = "features")
    private String features;

    public Car() {
    }

    public Car(
            Long id, String make, String model, int year, String color, String engine, String transmission,
            String fuelType, int mileage, String vin, int price, int ownerId, String features) {
        this.id = id;
        this.make = make;
        this.model = model;
        this.year = year;
        this.color = color;
        this.engine = engine;
        this.transmission = transmission;
        this.fuelType = fuelType;
        this.mileage = mileage;
        this.vin = vin;
        this.price = price;
        this.ownerId = ownerId;
        this.features = features;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMake() {
        return make;
    }

    public void setMake(String make) {
        this.make = make;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getEngine() {
        return engine;
    }

    public void setEngine(String engine) {
        this.engine = engine;
    }

    public String getTransmission() {
        return transmission;
    }

    public void setTransmission(String transmission) {
        this.transmission = transmission;
    }

    public String getFuelType() {
        return fuelType;
    }

    public void setFuelType(String fuelType) {
        this.fuelType = fuelType;
    }

    public int getMileage() {
        return mileage;
    }

    public void setMileage(int mileage) {
        this.mileage = mileage;
    }

    public String getVin() {
        return vin;
    }

    public void setVin(String vin) {
        this.vin = vin;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public int getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(int ownerId) {
        this.ownerId = ownerId;
    }

    public String getFeatures() {
        return features;
    }

    public void setFeatures(String features) {
        this.features = features;
    }

    @Override
    public String toString() {
        return "Car{"
                + "make=" + make
                + ", model='" + model + '\''
                + ", year='" + year + '\''
                + ", color='" + color + '\''
                + ", engine='" + engine + '\''
                + ", transmission='" + transmission + '\''
                + ", fuelType='" + fuelType + '\''
                + ", mileage='" + mileage + '\''
                + ", vin='" + vin + '\''
                + ", price='" + price + '\''
                + ", ownerId='" + ownerId + '\''
                + ", features='" + features + '\''
                + '}';

    }
}
