package com.hms.appointment_service.service.impl;

import com.hms.appointment_service.client.DoctorClient;
import com.hms.appointment_service.client.PatientClient;
import com.hms.appointment_service.dto.AppointmentDTO;
import com.hms.appointment_service.dto.DoctorDTO;
import com.hms.appointment_service.dto.PatientDTO;
import com.hms.appointment_service.event.AppointmentBookedEvent;
import com.hms.appointment_service.exception.ResourceNotFoundException;
import com.hms.appointment_service.model.Appointment;
import com.hms.appointment_service.model.AppointmentStatus;
import com.hms.appointment_service.repository.AppointmentRepository;
import com.hms.appointment_service.security.UserContext;
import com.hms.appointment_service.service.AppointmentService;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository repository;
    private final PatientClient patientClient;
    private final DoctorClient doctorClient;
    private final RabbitTemplate rabbitTemplate;
    private final UserContext userContext;

    @Override
    @Transactional
    @CircuitBreaker(name = "doctor-service-breaker", fallbackMethod = "doctorServiceFallback")
    public AppointmentDTO createAppointment(AppointmentDTO dto) {

        if (userContext.isPatient()) {
            PatientDTO patientCheck = patientClient.getPatientById(dto.getPatientId());
            if (!patientCheck.getEmail().equals(userContext.getLoggedInEmail())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: You cannot book appointments for others.");
            }
        }

        PatientDTO patient = patientClient.getPatientById(dto.getPatientId());
        DoctorDTO doctor = doctorClient.getDoctorById(dto.getDoctorId());


        Appointment appointment = new Appointment();
        appointment.setPatientId(dto.getPatientId());
        appointment.setDoctorId(dto.getDoctorId());
        appointment.setPatientEmail(patient.getEmail());
        appointment.setAppointmentTime(dto.getAppointmentTime());
        appointment.setReasonForVisit(dto.getReasonForVisit());
        appointment.setStatus(AppointmentStatus.SCHEDULED);

        Appointment savedAppointment = repository.save(appointment);

        // 3. SEND NOTIFICATION (The New Part!) ---------------------------

        AppointmentBookedEvent event = new AppointmentBookedEvent(
                savedAppointment.getId(),
                patient.getEmail(),
                "Hello " + patient.getFirstName() + ", your appointment with Dr. " + doctor.getName() + " is confirmed!"
        );

        // We drop the letter in the box
        rabbitTemplate.convertAndSend("internal.exchange", "internal.notification", event);
        System.out.println("Message sent to RabbitMQ for: " + patient.getEmail());

        return mapToDTO(savedAppointment);
    }
    public AppointmentDTO doctorServiceFallback(AppointmentDTO dto, Throwable t) {
        System.out.println("⚠️ Circuit Breaker Tripped! Doctor Service is unreachable.");

        throw new ResourceNotFoundException("Doctor Service is currently down. Please try again later. (Circuit Breaker Active)");
    }

    @Override
    public AppointmentDTO getAppointmentById(Long id) {
        Appointment appointment = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + id));

        validateAccess(appointment);

        return mapToDTO(appointment);
    }

    @Override
    public List<AppointmentDTO> getAllAppointments() {
        if (!userContext.isAdmin()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: Only Admins can view all appointments.");
        }
        return repository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public List<AppointmentDTO> getAppointmentsByPatientId(Long patientId) {
        if (userContext.isAdmin()) {
            return repository.findByPatientId(patientId).stream()
                    .map(this::mapToDTO).collect(Collectors.toList());
        }

        if (userContext.isPatient()) {
            PatientDTO patient = patientClient.getPatientById(patientId);

            if (!patient.getEmail().equals(userContext.getLoggedInEmail())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: You can only view your own appointments.");
            }

            return repository.findByPatientId(patientId).stream()
                    .map(this::mapToDTO).collect(Collectors.toList());
        }

        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: Doctors cannot view all patient appointments directly.");
    }

    @Override
    public List<AppointmentDTO> getAppointmentsByDoctorId(Long doctorId) {
        if (userContext.isAdmin()) {
            return repository.findByDoctorId(doctorId).stream()
                    .map(this::mapToDTO).collect(Collectors.toList());
        }

        if (userContext.isDoctor()) {
            DoctorDTO doctor = doctorClient.getDoctorById(doctorId);

            if (!doctor.getEmail().equals(userContext.getLoggedInEmail())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: You can only view your own schedule.");
            }

            return repository.findByDoctorId(doctorId).stream()
                    .map(this::mapToDTO).collect(Collectors.toList());
        }

        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: Patients cannot view doctor schedules directly.");
    }

    @Override
    public AppointmentDTO updateAppointment(Long id, AppointmentDTO dto) {
        Appointment existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + id));

        validateAccess(existing);

        boolean doctorChanged = dto.getDoctorId() != null && !dto.getDoctorId().equals(existing.getDoctorId());
        boolean timeChanged = dto.getAppointmentTime() != null && !dto.getAppointmentTime().equals(existing.getAppointmentTime());
        boolean reasonChanged = dto.getReasonForVisit() != null && !dto.getReasonForVisit().equals(existing.getReasonForVisit());

        if (!doctorChanged && !timeChanged && !reasonChanged) {
            return mapToDTO(existing);
        }

        DoctorDTO doctorForMessage = null;

        if (doctorChanged) {

            doctorForMessage = doctorClient.getDoctorById(dto.getDoctorId());
            existing.setDoctorId(dto.getDoctorId());
        }

        if (timeChanged) {
            existing.setAppointmentTime(dto.getAppointmentTime());
        }

        if (reasonChanged) {
            existing.setReasonForVisit(dto.getReasonForVisit());
        }

        Appointment saved = repository.save(existing);


        if (doctorForMessage == null) {
            doctorForMessage = doctorClient.getDoctorById(saved.getDoctorId());
        }

        String message = "Your appointment has been updated with Dr. " + doctorForMessage.getName()
                + ". Scheduled time: " + saved.getAppointmentTime() + ".";

        AppointmentBookedEvent event = new AppointmentBookedEvent(
                saved.getId(),
                saved.getPatientEmail(),
                message
        );

        rabbitTemplate.convertAndSend("internal.exchange", "internal.notification", event);

        return mapToDTO(saved);
    }

    @Override
    public void cancelAppointment(Long id) {
        Appointment existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + id));

        validateAccess(existing);

        if (existing.getStatus() == AppointmentStatus.CANCELLED) {
            return;
        }

        existing.setStatus(AppointmentStatus.CANCELLED);
        Appointment saved = repository.save(existing);

        String message = "Your appointment on " + saved.getAppointmentTime() + " has been cancelled.";

        AppointmentBookedEvent event = new AppointmentBookedEvent(
                saved.getId(),
                saved.getPatientEmail(),
                message
        );

        rabbitTemplate.convertAndSend("internal.exchange", "internal.notification", event);
    }

    private AppointmentDTO mapToDTO(Appointment appointment) {
        AppointmentDTO dto = new AppointmentDTO();
        dto.setId(appointment.getId());
        dto.setPatientId(appointment.getPatientId());
        dto.setDoctorId(appointment.getDoctorId());
        dto.setAppointmentTime(appointment.getAppointmentTime());
        dto.setReasonForVisit(appointment.getReasonForVisit());
        dto.setStatus(appointment.getStatus());
        return dto;
    }
    private void validateAccess(Appointment appt) {

        if (userContext.isAdmin()) return;

        String email = userContext.getLoggedInEmail();

        if (userContext.isPatient() && !appt.getPatientEmail().equals(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: This is not your appointment.");
        }

        if (userContext.isDoctor()) {

            DoctorDTO doc = doctorClient.getDoctorById(appt.getDoctorId());
            if (!doc.getEmail().equals(email)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: You are not assigned to this appointment.");
            }
        }
    }
}