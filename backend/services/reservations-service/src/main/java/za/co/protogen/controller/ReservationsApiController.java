package za.co.protogen.controller;

import org.springframework.http.HttpStatus;
import za.co.protogen.reservationsService.api.ReservationsApi;
import za.co.protogen.core.ReservationService;
import za.co.protogen.adapter.ReservationMapper;
import za.co.protogen.reservationsService.models.ReservationDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("reservations")
public class ReservationsApiController implements ReservationsApi {



    private static final Logger logger = LoggerFactory.getLogger(ReservationsApiController.class);

    private final ReservationService reservationService;
    
    public ReservationsApiController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping(produces = "application/json")
    public ResponseEntity<Void> addReservation(@RequestBody ReservationDTO body) {
        reservationService.addReservation(ReservationMapper.RESERVATION_MAPPER.reservationDTOToReservation(body));
        logger.info("adding reservations");
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping(value = "/id/{id}", produces = "application/json")
    public ResponseEntity<Void> removeReservation(@PathVariable Long id) {
        reservationService.removeReservation(id);
        logger.info("Removing a reservation by Id: {}", id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping(value = "/id/{id}", produces = "application/json")
    public ResponseEntity<ReservationDTO> getReservationById(@PathVariable Long id) {
        logger.info("Retrieving a reservation by Id: {}", id);
        ReservationDTO reservation = ReservationMapper.RESERVATION_MAPPER.reservationToReservationDTO(reservationService.getReservationById(id));
        return ResponseEntity.ok(reservation);
    }

    @GetMapping(produces = "application/json")
    public ResponseEntity<List<ReservationDTO>> getAllReservations() {
        logger.info("Retrieving all reservations");
        List<ReservationDTO> reservationDTOS = ReservationMapper.RESERVATION_MAPPER.reservationsToReservationDTOs(reservationService.getAllReservations());
        return ResponseEntity.ok(reservationDTOS);
    }

    @PutMapping(value = "/id/{id}", produces = "application/json")
    public ResponseEntity<Void> updateReservation(
            @PathVariable BigDecimal id, @RequestBody ReservationDTO updatedReservation) {
        logger.info("Updating user identified by id: {}, with user: {}", id, updatedReservation.toString());
        reservationService.updateReservation(id.longValue() , ReservationMapper.RESERVATION_MAPPER.reservationDTOToReservation(updatedReservation));
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping(value = "/search", produces = "application/json")
    public ResponseEntity<List<ReservationDTO>> searchReservations(
            @RequestParam(required = false) Long id,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String carId,
            @RequestParam(required = false) LocalDate fromDate,
            @RequestParam(required = false) LocalDate toDate,
            @RequestParam(required = false) String pickUpLocation,
            @RequestParam(required = false) String dropOffLocation) {
        List<ReservationDTO> reservations = ReservationMapper.RESERVATION_MAPPER.reservationsToReservationDTOs(reservationService.searchReservations(id, userId, carId, fromDate, toDate, pickUpLocation, dropOffLocation));
        return ResponseEntity.ok(reservations);
    }
}
