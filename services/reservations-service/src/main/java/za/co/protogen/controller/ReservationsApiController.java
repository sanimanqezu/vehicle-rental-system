package za.co.protogen.controller;

import za.co.protogen.core.ReservationService;
import za.co.protogen.domain.ReservationDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("rest/auth/reservations")
public class ReservationsApiController {

    private final ReservationService reservationService;
    
    public ReservationsApiController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping(produces = "application/json")
    public ResponseEntity<String> addReservation(@RequestBody ReservationDTO reservationDTO) {
        reservationService.addReservation(reservationDTO);
        return ResponseEntity.ok("Reservation added successfully");
    }

    @DeleteMapping(value = "/id/{id}", produces = "application/json")
    public ResponseEntity<String> removeReservation(@PathVariable Long id) {
        reservationService.removeReservation(id);
        return ResponseEntity.ok("Reservation removed successfully");
    }

    @GetMapping(value = "/id/{id}", produces = "application/json")
    public ResponseEntity<ReservationDTO> getReservationById(@PathVariable Long id) {
        ReservationDTO reservation = reservationService.getReservationById(id);
        return ResponseEntity.ok(reservation);
    }

    @GetMapping(produces = "application/json")
    public ResponseEntity<List<ReservationDTO>> getAllReservations() {
        List<ReservationDTO> reservations = reservationService.getAllReservations();
        return ResponseEntity.ok(reservations);
    }

    @PutMapping(value = "/id/{id}", produces = "application/json")
    public ResponseEntity<String> updateReservation(
            @PathVariable Long id, @RequestBody ReservationDTO updatedReservation) {
        updatedReservation.setId(id);
        reservationService.updateReservation(updatedReservation);
        return ResponseEntity.ok("Reservation updated successfully");
    }

    @GetMapping(value = "/search", produces = "application/json")
    public ResponseEntity<List<ReservationDTO>> searchReservations(
            @RequestParam(required = false) Long id,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Long carId,
            @RequestParam(required = false) LocalDate fromDate,
            @RequestParam(required = false) LocalDate toDate,
            @RequestParam(required = false) String pickUpLocation,
            @RequestParam(required = false) String dropOffLocation) {
        
        List<ReservationDTO> reservations = reservationService.searchReservations(
                id, userId, carId, fromDate, toDate, pickUpLocation, dropOffLocation);
        
        return ResponseEntity.ok(reservations);
    }
}
