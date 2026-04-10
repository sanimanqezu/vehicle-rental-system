package za.co.protogen.controller;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import za.co.protogen.carsService.api.CarsApi;
import za.co.protogen.core.impl.CarsServiceImpl;
import za.co.protogen.adapter.CarMapper;
import za.co.protogen.carsService.models.CarDTO;

import java.util.List;

@RequiredArgsConstructor
@Controller
@RequestMapping("/cars")
public class CarsApiController implements CarsApi {

    private final Logger logger = LoggerFactory.getLogger(CarsApiController.class);
    private final CarsServiceImpl carsService;

    @PostMapping(produces = "application/json")
    public ResponseEntity<Void> addCar(@RequestBody CarDTO car) {
        logger.info("Adding car: {}", car);
        carsService.addCar(CarMapper.CAR_MAPPER.carDTOToCar(car));
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping(value = "/vin/{vin}", produces = "application/json")
    public ResponseEntity<Void> removeCar(@PathVariable  String vin) {
        logger.info("Removing car with id: {}", vin);
        carsService.removeCar(vin);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping(value = "/vin/{vin}", produces = "application/json")
    public ResponseEntity<CarDTO> getCarById(@PathVariable String vin) {
        logger.info("Retrieving car with id: {}", vin);
        return ResponseEntity.ok(CarMapper.CAR_MAPPER.carToCarDTO(carsService.getCarById(vin)));
    }

    @GetMapping(produces = "application/json")
    public ResponseEntity<List<CarDTO>> getAllCars() {
        logger.info("Retrieving all cars");
        List<CarDTO> cars = CarMapper.CAR_MAPPER.carsToCarDTOs(carsService.getAllCars());
        return ResponseEntity.ok(cars);
    }

    @GetMapping(value = "/make/{make}", produces = "application/json")
    public ResponseEntity<List<CarDTO>> getCarsByMake(@PathVariable String make) {
        logger.info("Retrieving cars with make: {}", make);
        return ResponseEntity.ok(CarMapper.CAR_MAPPER.carsToCarDTOs(carsService.getCarsByMake(make)));
    }

    @GetMapping(value = "/year/{year}", produces = "application/json")
    public ResponseEntity<List<CarDTO>> getCarsByYear(@PathVariable int year) {
        logger.info("Retrieving cars with year: {}", year);
        return ResponseEntity.ok(CarMapper.CAR_MAPPER.carsToCarDTOs(carsService.getCarsByYear(year)));
    }

    @GetMapping(value = "/color/{color}", produces = "application/json")
    public ResponseEntity<List<CarDTO>> getCarsByColor(@PathVariable String color) {
        logger.info("Retrieving cars with color: {}", color);
        return ResponseEntity.ok(CarMapper.CAR_MAPPER.carsToCarDTOs(carsService.getCarsByColor(color)));

    }

    @PutMapping(value = "/vin/{vin}", produces = "application/json")
    public ResponseEntity<Void> updateCar(@PathVariable String vin, @RequestBody CarDTO updatedCar) {
        logger.info("Updating car with id: {}, new data: {}", vin, updatedCar);
        carsService.updateCar(vin, CarMapper.CAR_MAPPER.carDTOToCar(updatedCar));
        return ResponseEntity.status(HttpStatus.OK).build();
    }


    @GetMapping(value = "/search", produces = "application/json")
    public ResponseEntity<List<CarDTO>> searchCars(@RequestParam(required = false) String make,
                                                   @RequestParam(required = false) String model,
                                                   @RequestParam(required = false) Integer price,
                                                   @RequestParam(required = false) String color) {
        logger.info("Searching cars with parameters - make: {}, model: {}, price: {}, color: {}", make, model, price, color);
        List<CarDTO> cars = CarMapper.CAR_MAPPER.carsToCarDTOs(carsService.searchCars(make, model, price, color));
        return ResponseEntity.ok(cars);
    }
}
