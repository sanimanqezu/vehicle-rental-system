package za.co.protogen.adapter;

import org.mapstruct.Mapper;
import org.mapstruct.NullValuePropertyMappingStrategy;
import java.util.List;
import org.mapstruct.factory.Mappers;
import za.co.protogen.carsService.models.CarDTO;
import za.co.protogen.persistance.entity.Car;


@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface CarMapper {

    CarMapper CAR_MAPPER = Mappers.getMapper(CarMapper.class) ;

    CarDTO carToCarDTO(Car car);

    Car carDTOToCar(CarDTO carDTO);

    List<CarDTO> carsToCarDTOs(List<Car> cars);

    List<Car> carDTOsToCars(List<CarDTO> carDTOs);
}