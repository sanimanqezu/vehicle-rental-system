package za.co.protogen.core;
import za.co.protogen.domain.CarDTO;

import java.util.List;

public interface CarsService {

    void addCar(CarDTO car);

    void removeCar(Long id);

    CarDTO getCarById(Long id);

    List<CarDTO> getAllCars();

    List<CarDTO> getCarsByMake(String make);

    List<CarDTO> getCarsByYear(int year);

    List<CarDTO> getCarsByColor(String color);

    void updateCar(Long id, CarDTO updatedCar);

    List<CarDTO> calculateAverageMileage();

    List<CarDTO> findCheapestCar();

    List<CarDTO> findMostExpensiveCar();

    List<CarDTO> findNewestCar();

    List<CarDTO> findOldestCar();

    List<CarDTO> searchCars(String make, String model, int price, String color);

}
