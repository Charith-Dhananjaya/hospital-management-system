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
import com.hms.appointment_service.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository repository;
    private final PatientClient patientClient;
    private final DoctorClient doctorClient;
    private final RabbitTemplate rabbitTemplate;

    @Override
    public AppointmentDTO createAppointment(AppointmentDTO dto) {

        PatientDTO patient = patientClient.getPatientById(dto.getPatientId());
        DoctorDTO doctor = doctorClient.getDoctorById(dto.getDoctorId());


        Appointment appointment = new Appointment();
        appointment.setPatientId(dto.getPatientId());
        appointment.setDoctorId(dto.getDoctorId());
        appointment.setAppointmentTime(dto.getAppointmentTime());
        appointment.setReasonForVisit(dto.getReasonForVisit());
        appointment.setStatus(AppointmentStatus.SCHEDULED);

        Appointment savedAppointment = repository.save(appointment);

        // 3. SEND NOTIFICATION (The New Part!) ---------------------------

        AppointmentBookedEvent event = new AppointmentBookedEvent(
                savedAppointment.getId(),
                "test@gmail.com",
                "Your appointment is confirmed!"
        );

        // We drop the letter in the box
        rabbitTemplate.convertAndSend("internal.exchange", "internal.notification", event);
        System.out.println("Message sent to RabbitMQ!");

        return mapToDTO(savedAppointment);
    }

    @Override
    public AppointmentDTO getAppointmentById(Long id) {
        Appointment appointment = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + id));
        return mapToDTO(appointment);
    }

    @Override
    public List<AppointmentDTO> getAllAppointments() {
        return repository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public List<AppointmentDTO> getAppointmentsByPatientId(Long patientId) {
        return repository.findByPatientId(patientId).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public List<AppointmentDTO> getAppointmentsByDoctorId(Long doctorId) {
        return repository.findByDoctorId(doctorId).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public AppointmentDTO updateAppointment(Long id, AppointmentDTO dto) {
        Appointment existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + id));

        existing.setAppointmentTime(dto.getAppointmentTime());
        existing.setReasonForVisit(dto.getReasonForVisit());

        return mapToDTO(repository.save(existing));
    }

    @Override
    public void cancelAppointment(Long id) {
        Appointment existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + id));

        existing.setStatus(AppointmentStatus.CANCELLED);
        repository.save(existing);
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
}