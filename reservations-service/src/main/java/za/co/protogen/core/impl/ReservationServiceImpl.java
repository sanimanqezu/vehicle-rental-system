package za.co.protogen.core.impl;

import za.co.protogen.core.ReservationService;
import za.co.protogen.persistance.Reservation;
import za.co.protogen.domain.ReservationDTO;
import za.co.protogen.adapter.ReservationMapper;
import za.co.protogen.persistance.repository.ReservationRepository;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;

    public ReservationServiceImpl(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    @Override
    public void addReservation(ReservationDTO reservationDTO) {
        reservationRepository.save(ReservationMapper.RESERVATION_MAPPER.reservationDTOToReservation(reservationDTO));

    }

    @Override
    public void removeReservation(Long id) {
        boolean reservation = reservationRepository.existsById(id);
        if (!reservation ) {
            throw new RuntimeException("Reservation not found");
        }
        reservationRepository.delete(ReservationMapper.RESERVATION_MAPPER.reservationDTOToReservation(getReservationById(id)));
    }

    @Override
    public ReservationDTO getReservationById(Long id) {
        Optional<Reservation> reservationOptional = reservationRepository.findById(id);

        if (reservationOptional.isPresent()){
            return ReservationMapper.RESERVATION_MAPPER.reservationToReservationDTO(reservationOptional.get()); 
        }

        throw new RuntimeException("Reservation not found");
    }

    @Override
    public List<ReservationDTO> getAllReservations() {
        return ReservationMapper.RESERVATION_MAPPER.reservationsToReservationDTOs(reservationRepository.findAll());
    }

    @Override
    public void updateReservation(ReservationDTO updatedReservation) {
        ReservationDTO existingReservation = getReservationById(updatedReservation.getId());
        if (existingReservation != null && updatedReservation != null) {
            if (existingReservation.getUserId() != null) {
                existingReservation.setUserId(updatedReservation.getUserId());
            }
            if (existingReservation.getCarId() != null) {
                existingReservation.setCarId(updatedReservation.getCarId());
            }
            if (existingReservation.getFromDate() != null) {
                existingReservation.setFromDate(updatedReservation.getFromDate());
            }
            if (existingReservation.getToDate() != null) {
                existingReservation.setToDate(updatedReservation.getToDate());
            }
            if (existingReservation.getPickUpLocation() != null && !updatedReservation.getPickUpLocation().isEmpty()) {
                existingReservation.setPickUpLocation(updatedReservation.getPickUpLocation());
            }
            if (existingReservation.getDropOffLocation() != null && !updatedReservation.getDropOffLocation().isEmpty()) {
                existingReservation.setDropOffLocation(updatedReservation.getDropOffLocation());
            }
            reservationRepository.save(ReservationMapper.RESERVATION_MAPPER.reservationDTOToReservation(updatedReservation));
        }
    }

    @Override
    public List<ReservationDTO> searchReservations(Long id, Long userId, Long carId, LocalDate fromDate, LocalDate toDate, String pickUpLocation, String dropOffLocation) {
        List<ReservationDTO> reservations = new ArrayList<>();
        if (id != null) {
            reservations.add(ReservationMapper.RESERVATION_MAPPER.reservationToReservationDTO(reservationRepository.findById(id).get()));
        }
        if (userId != null) {
            reservations.add(ReservationMapper.RESERVATION_MAPPER.reservationToReservationDTO(reservationRepository.findByUserId(userId)));
        }
        if (carId != null) {
            reservations.add(ReservationMapper.RESERVATION_MAPPER.reservationToReservationDTO(reservationRepository.findByCarId(carId)));
        }
        if (fromDate != null) {
            reservations.addAll(ReservationMapper.RESERVATION_MAPPER.reservationsToReservationDTOs(reservationRepository.findByFromDate(fromDate)));
        }
        if (toDate != null) {
            reservations.addAll(ReservationMapper.RESERVATION_MAPPER.reservationsToReservationDTOs(reservationRepository.findByToDate(toDate)));
        }
        if (pickUpLocation != null && !pickUpLocation.isEmpty()) {
            reservations.addAll(ReservationMapper.RESERVATION_MAPPER.reservationsToReservationDTOs(reservationRepository.findByPickUpLocation(pickUpLocation)));
        }
        if (dropOffLocation != null && !dropOffLocation.isEmpty()) {
            reservations.addAll(ReservationMapper.RESERVATION_MAPPER.reservationsToReservationDTOs(reservationRepository.findByDropOffLocation(dropOffLocation)));
        }
        return reservations;
    }
}
