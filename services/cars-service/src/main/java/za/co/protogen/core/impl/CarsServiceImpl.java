package za.co.protogen.core.impl;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import za.co.protogen.core.CarsService;
import za.co.protogen.persistance.Car;
import za.co.protogen.persistance.repository.CarRepository;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class CarsServiceImpl implements CarsService {

    private final CarRepository carRepository;

    public CarsServiceImpl(CarRepository carRepository) {
        this.carRepository = carRepository;
    }

    @Override
    public void addCar(Car car) {
        carRepository.save(car);
    }

    @Override
    public void removeCar(String vin) {
        carRepository.delete(getCarById(vin));
    }

    @Override
    public Car getCarById(String vin) {
        Optional<Car> car = carRepository.findById(Long.valueOf(vin));
        return car.orElseGet(() -> (Car) ResponseEntity.status(HttpStatus.NOT_FOUND));
    }

    @Override
    @PreAuthorize("hasAuthority('SCOPE_user_read')")
    public List<Car> getAllCars() {
        return carRepository.findAll();
    }

    @Override
    public List<Car> getCarsByMake(String make) {
        return carRepository.findByMake(make);
    }

    @Override
    public List<Car> getCarsByYear(int year) {
        return carRepository.findByYear(year);
    }

    @Override
    public List<Car> getCarsByColor(String color) {return carRepository.findByColor(color);
    }

    @Override
    public void updateCar(String vin, Car updatedCar) {

        Car existingCar = getCarById(vin);
        if (existingCar != null && updatedCar != null) {
            if (updatedCar.getMake() != null && !updatedCar.getMake().isEmpty()) {
                existingCar.setMake(updatedCar.getMake());
            }
            if (updatedCar.getModel() != null && !updatedCar.getModel().isEmpty()) {
                existingCar.setModel(updatedCar.getModel());
            }
            if (updatedCar.getYear() != 0) {
                existingCar.setYear(updatedCar.getYear());
            }
            if (updatedCar.getColor() != null && !updatedCar.getColor().isEmpty()) {
                existingCar.setColor(updatedCar.getColor());
            }
            if (updatedCar.getEngine() != null && !updatedCar.getEngine().isEmpty()) {
                existingCar.setEngine(updatedCar.getEngine());
            }
            if (updatedCar.getTransmission() != null && !updatedCar.getTransmission().isEmpty()) {
                existingCar.setTransmission(updatedCar.getTransmission());
            }
            if (updatedCar.getFuelType() != null && !updatedCar.getFuelType().isEmpty()) {
                existingCar.setFuelType(updatedCar.getFuelType());
            }
            if (updatedCar.getMileage() >= 0) {
                existingCar.setMileage(updatedCar.getMileage());
            }
            if (updatedCar.getVin() != null && !updatedCar.getVin().isEmpty()) {
                existingCar.setVin(updatedCar.getVin());
            }
            if (updatedCar.getPrice() >= 0) {
                existingCar.setPrice(updatedCar.getPrice());
            }
            if (updatedCar.getOwnerId() >= 0) {
                existingCar.setOwnerId(updatedCar.getOwnerId());
            }
            if (updatedCar.getFeatures() != null && !updatedCar.getFeatures().isEmpty()) {
                existingCar.setFeatures(updatedCar.getFeatures());
            }
        }
    }

    @Override
    public Double calculateAverageMileage() {
        double totalMileage = carRepository.findAll().stream().mapToDouble(Car::getMileage).sum();
        return totalMileage / carRepository.findAll().size();
    }

    @Override
    public Car findMostExpensiveCar() {
        return carRepository.findAll().stream().max(Comparator.comparingDouble(Car::getPrice)).orElse(null);
    }

    @Override
    public Car findCheapestCar() {
        return carRepository.findAll().stream().min(Comparator.comparingDouble(Car::getPrice)).orElse(null);
    }

    @Override
    public Car findNewestCar() {
        return carRepository.findAll().stream().max(Comparator.comparingInt(Car::getYear)).orElse(null);
    }

    @Override
    public Car findOldestCar() {
        return carRepository.findAll().stream().min(Comparator.comparingInt(Car::getYear)).orElse(null);
    }

    @Override
    public List<Car> searchCars(String make, String model, int price, String color) {
        List<Car> cars = new ArrayList<>();
        if (make != null && !make.isEmpty()) {
            cars.addAll(carRepository.findByMake(make));
        }
        if (model != null && !model.isEmpty()) {
            cars.addAll(carRepository.findByModel(model));
        }
        
        cars.addAll(carRepository.findByPrice(price));

        if (color != null && !color.isEmpty()) {
            cars.addAll(carRepository.findByColor(color));
        }
        return cars;
    }
}
