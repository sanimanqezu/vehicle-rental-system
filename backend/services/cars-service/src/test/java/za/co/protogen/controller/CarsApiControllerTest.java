package za.co.protogen.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.oauth2.resource.servlet.OAuth2ResourceServerAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import za.co.protogen.carsService.models.CarDTO;
import za.co.protogen.core.impl.CarsServiceImpl;
import za.co.protogen.persistance.entity.Car;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = CarsApiController.class,
        excludeAutoConfiguration = {SecurityAutoConfiguration.class, OAuth2ResourceServerAutoConfiguration.class})
@AutoConfigureMockMvc(addFilters = false)
class CarsApiControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private CarsServiceImpl carsService;

    private Car sampleEntity() {
        return new Car("Toyota", "Corolla", 2021, "White", "1.8L", "Automatic",
                "Gasoline", 10000, "1", 25000, 123, List.of("GPS"));
    }

    @Test
    void getAllCars_returns200WithList() throws Exception {
        when(carsService.getAllCars()).thenReturn(List.of(sampleEntity()));

        mockMvc.perform(get("/cars"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].make").value("Toyota"))
                .andExpect(jsonPath("$[0].vin").value("1"));

        verify(carsService).getAllCars();
    }

    @Test
    void getCarById_returns200WithCar() throws Exception {
        when(carsService.getCarById("1")).thenReturn(sampleEntity());

        mockMvc.perform(get("/cars/vin/{vin}", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.make").value("Toyota"));

        verify(carsService).getCarById("1");
    }

    @Test
    void getCarsByMake_delegatesAndReturns200() throws Exception {
        when(carsService.getCarsByMake("Toyota")).thenReturn(List.of(sampleEntity()));

        mockMvc.perform(get("/cars/make/{make}", "Toyota"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].model").value("Corolla"));

        verify(carsService).getCarsByMake("Toyota");
    }

    @Test
    void getCarsByYear_delegatesAndReturns200() throws Exception {
        when(carsService.getCarsByYear(2021)).thenReturn(List.of(sampleEntity()));

        mockMvc.perform(get("/cars/year/{year}", "2021"))
                .andExpect(status().isOk());

        verify(carsService).getCarsByYear(2021);
    }

    @Test
    void addCar_returns200AndDelegates() throws Exception {
        CarDTO dto = new CarDTO();
        dto.setVin("1");
        dto.setMake("Toyota");

        mockMvc.perform(post("/cars")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());

        verify(carsService).addCar(any(Car.class));
    }

    @Test
    void updateCar_returns200AndDelegates() throws Exception {
        CarDTO dto = new CarDTO();
        dto.setColor("Black");

        mockMvc.perform(put("/cars/vin/{vin}", "1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());

        verify(carsService).updateCar(eq("1"), any(Car.class));
    }

    @Test
    void removeCar_returns200AndDelegates() throws Exception {
        mockMvc.perform(delete("/cars/vin/{vin}", "1"))
                .andExpect(status().isOk());

        verify(carsService).removeCar("1");
    }

    @Test
    void searchCars_passesQueryParams() throws Exception {
        when(carsService.searchCars("Toyota", null, null, "White"))
                .thenReturn(List.of(sampleEntity()));

        mockMvc.perform(get("/cars/search")
                        .param("make", "Toyota")
                        .param("color", "White"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].vin").value("1"));

        verify(carsService).searchCars("Toyota", null, null, "White");
    }
}
