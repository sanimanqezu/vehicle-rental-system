package za.co.protogen.persistance.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import za.co.protogen.persistance.entity.Car;

@Repository
public interface CarRepository extends JpaRepository<Car, String> {

    List<Car> findByMake(String make);

    List<Car> findByModel(String model);

    List<Car> findByYear(int year);

    List<Car> findByColor(String color);

    List<Car> findByEngine(String engine);

    List<Car> findByTransmission(String transmission);

    List<Car> findByFuelType(String fuelType);

    List<Car> findByMileage(int mileage);

    List<Car> findByVin(String vin);

    List<Car> findByPrice(int price);

    List<Car> findByOwnerId(int ownerId);

    List<Car> findByFeatures(String features);
}
