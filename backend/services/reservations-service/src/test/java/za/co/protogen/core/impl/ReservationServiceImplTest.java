package za.co.protogen.core.impl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import za.co.protogen.persistance.Reservation;
import za.co.protogen.persistance.repository.ReservationRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReservationServiceImplTest {

    @Mock
    private ReservationRepository reservationRepository;

    @InjectMocks
    private ReservationServiceImpl reservationService;

    private Reservation reservation;

    @BeforeEach
    void setUp() {
        reservation = new Reservation(1L, 10L, "CAR-1",
                LocalDate.of(2024, 1, 1), LocalDate.of(2024, 1, 5),
                "Cape Town", "Johannesburg");
    }

    @Test
    void addReservation_persistsEntity() {
        reservationService.addReservation(reservation);

        verify(reservationRepository).save(reservation);
    }

    @Test
    void getReservationById_returnsReservation_whenFound() {
        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));

        assertThat(reservationService.getReservationById(1L)).isSameAs(reservation);
    }

    @Test
    void getReservationById_throws_whenNotFound() {
        when(reservationRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> reservationService.getReservationById(1L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Reservation not found");
    }

    @Test
    void removeReservation_deletes_whenExists() {
        when(reservationRepository.existsById(1L)).thenReturn(true);
        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));

        reservationService.removeReservation(1L);

        verify(reservationRepository).delete(reservation);
    }

    @Test
    void removeReservation_throws_whenMissing() {
        when(reservationRepository.existsById(1L)).thenReturn(false);

        assertThatThrownBy(() -> reservationService.removeReservation(1L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Reservation not found");
        verify(reservationRepository, never()).delete(any());
    }

    @Test
    void getAllReservations_delegatesToRepository() {
        when(reservationRepository.findAll()).thenReturn(List.of(reservation));

        assertThat(reservationService.getAllReservations()).containsExactly(reservation);
    }

    @Test
    void updateReservation_overwritesProvidedFieldsAndSaves() {
        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));

        Reservation patch = new Reservation();
        patch.setCarId("CAR-2");
        patch.setDropOffLocation("Durban");

        reservationService.updateReservation(1L, patch);

        assertThat(reservation.getCarId()).isEqualTo("CAR-2");
        assertThat(reservation.getDropOffLocation()).isEqualTo("Durban");
        // untouched fields preserved
        assertThat(reservation.getUserId()).isEqualTo(10L);
        assertThat(reservation.getPickUpLocation()).isEqualTo("Cape Town");
        verify(reservationRepository).save(reservation);
    }

    @Test
    void updateReservation_ignoresNullFields() {
        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));

        Reservation patch = new Reservation();
        patch.setPickUpLocation(""); // empty -> ignored

        reservationService.updateReservation(1L, patch);

        assertThat(reservation.getPickUpLocation()).isEqualTo("Cape Town");
        verify(reservationRepository).save(reservation);
    }

    @Test
    void updateReservation_throws_whenReservationMissing() {
        when(reservationRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> reservationService.updateReservation(1L, new Reservation()))
                .isInstanceOf(RuntimeException.class);
        verify(reservationRepository, never()).save(any());
    }

    @Test
    void searchReservations_byIdUsesFindById() {
        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));

        List<Reservation> result = reservationService.searchReservations(
                1L, null, null, null, null, null, null);

        assertThat(result).containsExactly(reservation);
    }

    @Test
    void searchReservations_aggregatesAcrossProvidedCriteria() {
        Reservation byUser = new Reservation(2L, 10L, "CAR-9", null, null, null, null);
        when(reservationRepository.findByUserId(10L)).thenReturn(List.of(byUser));
        when(reservationRepository.findByCarId("CAR-1")).thenReturn(List.of(reservation));

        List<Reservation> result = reservationService.searchReservations(
                null, 10L, "CAR-1", null, null, null, null);

        assertThat(result).containsExactly(byUser, reservation);
        verify(reservationRepository, never()).findByPickUpLocation(any());
    }

    @Test
    void searchReservations_returnsEmpty_whenNoCriteria() {
        assertThat(reservationService.searchReservations(
                null, null, null, null, null, null, null)).isEmpty();
    }
}
