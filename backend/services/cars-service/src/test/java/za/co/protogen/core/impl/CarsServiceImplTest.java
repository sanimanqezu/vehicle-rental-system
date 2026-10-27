package za.co.protogen.core.impl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import za.co.protogen.persistance.entity.Car;
import za.co.protogen.persistance.repository.CarRepository;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CarsServiceImplTest {

    @Mock
    private CarRepository carRepository;

    @InjectMocks
    private CarsServiceImpl carsService;

    private Car toyota;
    private Car honda;

    @BeforeEach
    void setUp() {
        toyota = new Car("Toyota", "Corolla", 2021, "White", "1.8L", "Automatic",
                "Gasoline", 10000, "1", 25000, 123, List.of("GPS"));
        honda = new Car("Honda", "Civic", 2020, "Red", "1.5L", "CVT",
                "Gasoline", 15000, "2", 22000, 456, List.of("Sunroof"));
    }

    @Test
    void addCar_persistsEntity() {
        carsService.addCar(toyota);

        verify(carRepository).save(toyota);
    }

    @Test
    void getCarById_returnsCar_whenFound() {
        when(carRepository.findById("1")).thenReturn(Optional.of(toyota));

        Car result = carsService.getCarById("1");

        assertThat(result).isSameAs(toyota);
    }

    @Test
    void getCarById_resolvesByAlphanumericVin() {
        String vin = "1HGBH41JXMN109186";
        toyota.setVin(vin);
        when(carRepository.findById(vin)).thenReturn(Optional.of(toyota));

        assertThat(carsService.getCarById(vin)).isSameAs(toyota);
    }

    @Test
    void getCarById_throws_whenNotFound() {
        when(carRepository.findById("99")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> carsService.getCarById("99"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Car not found with VIN: 99");
    }

    @Test
    void removeCar_deletesResolvedCar_whenFound() {
        when(carRepository.findById("1")).thenReturn(Optional.of(toyota));

        carsService.removeCar("1");

        verify(carRepository).delete(toyota);
    }

    @Test
    void removeCar_throws_whenNotFound() {
        when(carRepository.findById("99")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> carsService.removeCar("99"))
                .isInstanceOf(RuntimeException.class);
        verify(carRepository, never()).delete(org.mockito.ArgumentMatchers.any());
    }

    @Test
    void getAllCars_delegatesToRepository() {
        when(carRepository.findAll()).thenReturn(List.of(toyota, honda));

        assertThat(carsService.getAllCars()).containsExactly(toyota, honda);
    }

    @Test
    void getCarsByMake_delegatesToRepository() {
        when(carRepository.findByMake("Toyota")).thenReturn(List.of(toyota));

        assertThat(carsService.getCarsByMake("Toyota")).containsExactly(toyota);
    }

    @Test
    void getCarsByYear_delegatesToRepository() {
        when(carRepository.findByYear(2020)).thenReturn(List.of(honda));

        assertThat(carsService.getCarsByYear(2020)).containsExactly(honda);
    }

    @Test
    void getCarsByColor_delegatesToRepository() {
        when(carRepository.findByColor("Red")).thenReturn(List.of(honda));

        assertThat(carsService.getCarsByColor("Red")).containsExactly(honda);
    }

    @Test
    void updateCar_onlyOverwritesProvidedFields() {
        when(carRepository.findById("1")).thenReturn(Optional.of(toyota));

        Car patch = new Car();
        patch.setColor("Black");
        patch.setPrice(30000);

        carsService.updateCar("1", patch);

        assertThat(toyota.getColor()).isEqualTo("Black");
        assertThat(toyota.getPrice()).isEqualTo(30000);
        // untouched fields are preserved
        assertThat(toyota.getMake()).isEqualTo("Toyota");
        assertThat(toyota.getModel()).isEqualTo("Corolla");
        assertThat(toyota.getYear()).isEqualTo(2021);
        // the mutated entity is persisted
        verify(carRepository).save(toyota);
    }

    @Test
    void updateCar_ignoresNullAndEmptyStringFields() {
        when(carRepository.findById("1")).thenReturn(Optional.of(toyota));

        Car patch = new Car();
        patch.setMake("");   // empty -> ignored
        patch.setModel(null); // null -> ignored

        carsService.updateCar("1", patch);

        assertThat(toyota.getMake()).isEqualTo("Toyota");
        assertThat(toyota.getModel()).isEqualTo("Corolla");
    }

    @Test
    void calculateAverageMileage_averagesAllCars() {
        when(carRepository.findAll()).thenReturn(List.of(toyota, honda));

        assertThat(carsService.calculateAverageMileage()).isEqualTo(12500.0);
    }

    @Test
    void findMostExpensiveCar_returnsHighestPrice() {
        when(carRepository.findAll()).thenReturn(List.of(toyota, honda));

        assertThat(carsService.findMostExpensiveCar()).isSameAs(toyota);
    }

    @Test
    void findCheapestCar_returnsLowestPrice() {
        when(carRepository.findAll()).thenReturn(List.of(toyota, honda));

        assertThat(carsService.findCheapestCar()).isSameAs(honda);
    }

    @Test
    void findNewestCar_returnsLatestYear() {
        when(carRepository.findAll()).thenReturn(List.of(toyota, honda));

        assertThat(carsService.findNewestCar()).isSameAs(toyota);
    }

    @Test
    void findOldestCar_returnsEarliestYear() {
        when(carRepository.findAll()).thenReturn(List.of(toyota, honda));

        assertThat(carsService.findOldestCar()).isSameAs(honda);
    }

    @Test
    void findMostExpensiveCar_returnsNull_whenNoCars() {
        when(carRepository.findAll()).thenReturn(List.of());

        assertThat(carsService.findMostExpensiveCar()).isNull();
    }

    @Test
    void searchCars_aggregatesMatchesAcrossProvidedCriteria() {
        when(carRepository.findByMake("Toyota")).thenReturn(List.of(toyota));
        when(carRepository.findByColor("Red")).thenReturn(List.of(honda));

        List<Car> result = carsService.searchCars("Toyota", null, null, "Red");

        assertThat(result).containsExactly(toyota, honda);
        verify(carRepository, never()).findByModel(org.mockito.ArgumentMatchers.anyString());
        verify(carRepository, never()).findByPrice(org.mockito.ArgumentMatchers.anyInt());
    }

    @Test
    void searchCars_returnsEmpty_whenNoCriteriaProvided() {
        List<Car> result = carsService.searchCars(null, null, null, null);

        assertThat(result).isEmpty();
    }

    @Test
    void addCar_passesSameInstanceThrough() {
        carsService.addCar(honda);

        ArgumentCaptor<Car> captor = ArgumentCaptor.forClass(Car.class);
        verify(carRepository).save(captor.capture());
        assertThat(captor.getValue().getVin()).isEqualTo("2");
    }
}
