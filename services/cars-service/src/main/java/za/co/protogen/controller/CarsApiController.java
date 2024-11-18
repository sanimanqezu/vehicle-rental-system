package za.co.protogen.controller;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import za.co.protogen.core.impl.CarsServiceImpl;
import za.co.protogen.domain.CarDTO;

import java.util.List;

@RequiredArgsConstructor
@Controller
@RequestMapping("rest/auth/cars")
public class CarsApiController {

    private final Logger logger = LoggerFactory.getLogger(CarsApiController.class);
    private final CarsServiceImpl carsService;

    @PostMapping(produces = "application/json")
    public ResponseEntity<Void> addCar(@RequestBody CarDTO car) {
        logger.info("Adding car: {}", car);
        carsService.addCar(car);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping(value = "/id/{id}", produces = "application/json")
    public ResponseEntity<Void> removeCar(@PathVariable Long id) {
        logger.info("Removing car with id: {}", id);
        carsService.removeCar(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping(value = "/id/{id}", produces = "application/json")
    public ResponseEntity<CarDTO> getCarById(@PathVariable Long id) {
        logger.info("Retrieving car with id: {}", id);
        CarDTO car = carsService.getCarById(id);
        return ResponseEntity.ok(car);
    }

    @GetMapping(produces = "application/json")
    public ResponseEntity<List<CarDTO>> getAllCars() {
        logger.info("Retrieving all cars");
        List<CarDTO> cars = carsService.getAllCars();
        return ResponseEntity.ok(cars);
    }

    @GetMapping(value = "/make/{make}", produces = "application/json")
    public ResponseEntity<List<CarDTO>> getCarsByMake(@PathVariable String make) {
        logger.info("Retrieving cars with make: {}", make);
        List<CarDTO> cars = carsService.getCarsByMake(make);
        return ResponseEntity.ok(cars);
    }

    @GetMapping(value = "/year/{year}", produces = "application/json")
    public ResponseEntity<List<CarDTO>> getCarsByYear(@PathVariable int year) {
        logger.info("Retrieving cars with year: {}", year);
        List<CarDTO> cars = carsService.getCarsByYear(year);
        return ResponseEntity.ok(cars);
    }

    @GetMapping(value = "/color/{color}", produces = "application/json")
    public ResponseEntity<List<CarDTO>> getCarsByColor(@PathVariable String color) {
        logger.info("Retrieving cars with color: {}", color);
        List<CarDTO> cars = carsService.getCarsByColor(color);
        return ResponseEntity.ok(cars);
    }

    @PutMapping(value = "/id/{id}", produces = "application/json")
    public ResponseEntity<Void> updateCar(@PathVariable Long id, @RequestBody CarDTO updatedCar) {
        logger.info("Updating car with id: {}, new data: {}", id, updatedCar);
        carsService.updateCar(id, updatedCar);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping(value = "/average-mileage", produces = "application/json")
    public ResponseEntity<List<CarDTO>> calculateAverageMileage() {
        logger.info("Calculating average mileage");
        List<CarDTO> cars = carsService.calculateAverageMileage();
        return ResponseEntity.ok(cars);
    }

    @GetMapping(value = "/cheapest", produces = "application/json")
    public ResponseEntity<List<CarDTO>> findCheapestCar() {
        logger.info("Finding cheapest car");
        List<CarDTO> cars = carsService.findCheapestCar();
        return ResponseEntity.ok(cars);
    }

    @GetMapping(value = "/most-expensive", produces = "application/json")
    public ResponseEntity<List<CarDTO>> findMostExpensiveCar() {
        logger.info("Finding most expensive car");
        List<CarDTO> cars = carsService.findMostExpensiveCar();
        return ResponseEntity.ok(cars);
    }

    @GetMapping(value = "/newest", produces = "application/json")
    public ResponseEntity<List<CarDTO>> findNewestCar() {
        logger.info("Finding newest car");
        List<CarDTO> cars = carsService.findNewestCar();
        return ResponseEntity.ok(cars);
    }

    @GetMapping(value = "/oldest", produces = "application/json")
    public ResponseEntity<List<CarDTO>> findOldestCar() {
        logger.info("Finding oldest car");
        List<CarDTO> cars = carsService.findOldestCar();
        return ResponseEntity.ok(cars);
    }

    @GetMapping(value = "/search", produces = "application/json")
    public ResponseEntity<List<CarDTO>> searchCars(@RequestParam(required = false) String make,
                                                   @RequestParam(required = false) String model,
                                                   @RequestParam(required = false) Integer price,
                                                   @RequestParam(required = false) String color) {
        logger.info("Searching cars with parameters - make: {}, model: {}, price: {}, color: {}", make, model, price, color);
        List<CarDTO> cars = carsService.searchCars(make, model, price, color);
        return ResponseEntity.ok(cars);
    }
}
