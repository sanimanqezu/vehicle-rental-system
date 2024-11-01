package za.co.protogen.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import za.co.protogen.core.CarsService;
import za.co.protogen.domain.CarDTO;

import java.util.List;

@RestController
@RequestMapping(value = "/cars")
public class CarsApiController {

    private final CarsService carsService;

    public CarsApiController(CarsService carsService) {
        this.carsService = carsService;
    }

    @PostMapping(produces = "application/json")
    public ResponseEntity<Void> addCar(@RequestBody CarDTO car) {
        carsService.addCar(car);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping(value = "/id/{id}", produces = "application/json")
    public ResponseEntity<Void> removeCar(@PathVariable Long id) {
        carsService.removeCar(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping(value = "/id/{id}", produces = "application/json")
    public ResponseEntity<CarDTO> getCarById(@PathVariable Long id) {
        CarDTO car = carsService.getCarById(id);
        return ResponseEntity.ok(car);
    }

    @GetMapping(produces = "application/json")
    public ResponseEntity<List<CarDTO>> getAllCars() {
        List<CarDTO> cars = carsService.getAllCars();
        return ResponseEntity.ok(cars);
    }

    @GetMapping(value = "/make/{make}", produces = "application/json")
    public ResponseEntity<List<CarDTO>> getCarsByMake(@PathVariable String make) {
        List<CarDTO> cars = carsService.getCarsByMake(make);
        return ResponseEntity.ok(cars);
    }

    @GetMapping(value = "/year/{year}", produces = "application/json")
    public ResponseEntity<List<CarDTO>> getCarsByYear(@PathVariable int year) {
        List<CarDTO> cars = carsService.getCarsByYear(year);
        return ResponseEntity.ok(cars);
    }

    @GetMapping(value = "/color/{color}", produces = "application/json")
    public ResponseEntity<List<CarDTO>> getCarsByColor(@PathVariable String color) {
        List<CarDTO> cars = carsService.getCarsByColor(color);
        return ResponseEntity.ok(cars);
    }

    @PutMapping(value = "/id/{id}", produces = "application/json")
    public ResponseEntity<Void> updateCar(@PathVariable Long id, @RequestBody CarDTO updatedCar) {
        carsService.updateCar(id, updatedCar);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping(value = "/average-mileage", produces = "application/json")
    public ResponseEntity<List<CarDTO>> calculateAverageMileage() {
        List<CarDTO> cars = carsService.calculateAverageMileage();
        return ResponseEntity.ok(cars);
    }

    @GetMapping(value = "/cheapest", produces = "application/json")
    public ResponseEntity<List<CarDTO>> findCheapestCar() {
        List<CarDTO> cars = carsService.findCheapestCar();
        return ResponseEntity.ok(cars);
    }

    @GetMapping(value = "/most-expensive}", produces = "application/json") 
    public ResponseEntity<List<CarDTO>> findMostExpensiveCar() {
        List<CarDTO> cars = carsService.findMostExpensiveCar();
        return ResponseEntity.ok(cars);
    }

    @GetMapping(value = "/newest", produces = "application/json")
    public ResponseEntity<List<CarDTO>> findNewestCar() {
        List<CarDTO> cars = carsService.findNewestCar();
        return ResponseEntity.ok(cars);
    }

    @GetMapping(value = "/oldest", produces = "application/json")
    public ResponseEntity<List<CarDTO>> findOldestCar() {
        List<CarDTO> cars = carsService.findOldestCar();
        return ResponseEntity.ok(cars);
    }

    @GetMapping(value = "/search", produces = "application/json")
    public ResponseEntity<List<CarDTO>> searchCars(@RequestParam(required = false) String make,
            @RequestParam(required = false) String model,
            @RequestParam(required = false) Integer price,
            @RequestParam(required = false) String color) {
        List<CarDTO> cars = carsService.searchCars(make, model, price, color);
        return ResponseEntity.ok(cars);
    }
}
