package za.co.protogen.core;
import za.co.protogen.persistance.entity.Car;

import java.util.List;

public interface CarsService {

    void addCar(Car car);

    void removeCar(String vin);

    Car getCarById(String vin);

    List<Car> getAllCars();

    List<Car> getCarsByMake(String make);

    List<Car> getCarsByYear(int year);

    List<Car> getCarsByColor(String color);

    void updateCar(String vin, Car updatedCar);

    Double calculateAverageMileage();

    Car findMostExpensiveCar();

    Car findCheapestCar();

    Car findNewestCar();

    Car findOldestCar();

    List<Car> searchCars(String make, String model, Integer price, String color);

}
