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
import za.co.protogen.core.ReservationService;
import za.co.protogen.persistance.Reservation;
import za.co.protogen.reservationsService.models.ReservationDTO;

import java.time.LocalDate;
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

@WebMvcTest(controllers = ReservationsApiController.class,
        excludeAutoConfiguration = {SecurityAutoConfiguration.class, OAuth2ResourceServerAutoConfiguration.class})
@AutoConfigureMockMvc(addFilters = false)
class ReservationsApiControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private ReservationService reservationService;

    private Reservation sample() {
        return new Reservation(1L, 10L, "CAR-1",
                LocalDate.of(2024, 1, 1), LocalDate.of(2024, 1, 5),
                "Cape Town", "Johannesburg");
    }

    @Test
    void getAllReservations_returns200WithList() throws Exception {
        when(reservationService.getAllReservations()).thenReturn(List.of(sample()));

        mockMvc.perform(get("/reservations"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].carId").value("CAR-1"));

        verify(reservationService).getAllReservations();
    }

    @Test
    void getReservationById_returns200() throws Exception {
        when(reservationService.getReservationById(1L)).thenReturn(sample());

        mockMvc.perform(get("/reservations/id/{id}", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(10));

        verify(reservationService).getReservationById(1L);
    }

    @Test
    void addReservation_returns200AndDelegates() throws Exception {
        ReservationDTO dto = new ReservationDTO();
        dto.setId(1L);
        dto.setCarId("CAR-1");

        mockMvc.perform(post("/reservations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());

        verify(reservationService).addReservation(any(Reservation.class));
    }

    @Test
    void updateReservation_returns200AndDelegates() throws Exception {
        ReservationDTO dto = new ReservationDTO();
        dto.setDropOffLocation("Durban");

        mockMvc.perform(put("/reservations/id/{id}", "1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());

        verify(reservationService).updateReservation(eq(1L), any(Reservation.class));
    }

    @Test
    void removeReservation_returns200AndDelegates() throws Exception {
        mockMvc.perform(delete("/reservations/id/{id}", "1"))
                .andExpect(status().isOk());

        verify(reservationService).removeReservation(1L);
    }

    @Test
    void searchReservations_passesQueryParams() throws Exception {
        when(reservationService.searchReservations(null, 10L, "CAR-1", null, null, null, null))
                .thenReturn(List.of(sample()));

        mockMvc.perform(get("/reservations/search")
                        .param("userId", "10")
                        .param("carId", "CAR-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));

        verify(reservationService).searchReservations(null, 10L, "CAR-1", null, null, null, null);
    }
}
