package za.co.protogen.core.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.co.protogen.core.CarsService;
import za.co.protogen.domain.CarDTO;
import za.co.protogen.persistance.Car;
import za.co.protogen.persistance.repository.CarRepository;
import za.co.protogen.adapter.CarMapper;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CarsServiceImpl implements CarsService {

    private final CarRepository carRepository;

    public CarsServiceImpl(CarRepository carRepository) {
        this.carRepository = carRepository;
    }

    @Override
    public void addCar(CarDTO carDTO) {
        Car car = CarMapper.CAR_MAPPER.carDTOToCar(carDTO);
        carRepository.save(car);
    }

    @Override
    public void removeCar(Long id) {
        carRepository.delete(CarMapper.CAR_MAPPER.carDTOToCar(getCarById(id)));
    }

    @Override
    public CarDTO getCarById(Long id) {
        return CarMapper.CAR_MAPPER.carToCarDTO(carRepository.findById(id).get());
    }

    @Override
    public List<CarDTO> getAllCars() {
        List<CarDTO> cars = CarMapper.CAR_MAPPER.carsToCarDTOs(carRepository.findAll());
        return cars;
    }

    @Override
    public List<CarDTO> getCarsByMake(String make) {
        List<CarDTO> cars = CarMapper.CAR_MAPPER.carsToCarDTOs(carRepository.findByMake(make));
        return cars;
    }

    @Override
    public List<CarDTO> getCarsByYear(int year) {
        List<CarDTO> cars = CarMapper.CAR_MAPPER.carsToCarDTOs(carRepository.findByYear(year));
        return cars;
    }

    @Override
    public List<CarDTO> getCarsByColor(String color) {
        List<CarDTO> cars = CarMapper.CAR_MAPPER.carsToCarDTOs(carRepository.findByColor(color));
        return cars;
    }

    @Override
    public void updateCar(Long id, CarDTO updatedCar) {

        CarDTO existingCar = getCarById(id);
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
            carRepository.save(CarMapper.CAR_MAPPER.carDTOToCar(existingCar));
        }
    }

    @Override
    public List<CarDTO> calculateAverageMileage() {
        List<Car> allCars = carRepository.findAll();
        double averageMileage = allCars.stream()
                .mapToDouble(Car::getMileage)
                .average()
                .orElse(0.0);

        return allCars.stream()
                .map(car -> {
                    CarDTO carDto = CarMapper.CAR_MAPPER.carToCarDTO(car);
                    carDto.setMileage((int) averageMileage);
                    return carDto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<CarDTO> findCheapestCar() {
        List<Car> cars = carRepository.findAll();
        Car cheapestCar = cars.stream().min(Comparator.comparingDouble(Car::getPrice)).orElse(null);

        return cheapestCar != null
                ? List.of(CarMapper.CAR_MAPPER.carToCarDTO(cheapestCar))
                : List.of();
    }

    @Override
    public List<CarDTO> findMostExpensiveCar() {
        List<Car> cars = carRepository.findAll();
        Car mostExpensiveCar = cars.stream().max(Comparator.comparingDouble(Car::getPrice)).orElse(null);

        return mostExpensiveCar != null
                ? List.of(CarMapper.CAR_MAPPER.carToCarDTO(mostExpensiveCar))
                : List.of();
    }

    @Override
    public List<CarDTO> findNewestCar() {
        List<Car> cars = carRepository.findAll();
        Car newestCar = cars.stream().max(Comparator.comparingInt(Car::getYear)).orElse(null);

        return newestCar != null
                ? List.of(CarMapper.CAR_MAPPER.carToCarDTO(newestCar))
                : List.of();
    }

    @Override
    public List<CarDTO> findOldestCar() {
        List<Car> cars = carRepository.findAll();
        Optional<Car> oldestCar = cars.stream()
                .min(Comparator.comparingInt(Car::getYear));

        return oldestCar.map(car -> List.of(CarMapper.CAR_MAPPER.carToCarDTO(car)))
                .orElseGet(Collections::emptyList);
    }

    @Override
    public List<CarDTO> searchCars(String make, String model, int price, String color) {
        List<CarDTO> cars = new ArrayList<>();
        if (make != null && !make.isEmpty()) {
            cars.addAll(CarMapper.CAR_MAPPER.carsToCarDTOs(carRepository.findByMake(make)));
        }
        if (model != null && !model.isEmpty()) {
            cars.addAll(CarMapper.CAR_MAPPER.carsToCarDTOs(carRepository.findByModel(model)));
        }
        
        cars.addAll(CarMapper.CAR_MAPPER.carsToCarDTOs(carRepository.findByPrice(price)));

        if (color != null && !color.isEmpty()) {
            cars.addAll(CarMapper.CAR_MAPPER.carsToCarDTOs(carRepository.findByColor(color)));
        }
        return cars;
    }
}
