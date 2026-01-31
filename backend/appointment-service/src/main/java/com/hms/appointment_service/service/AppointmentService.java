package com.hms.appointment_service.service;

import com.hms.appointment_service.dto.AppointmentDTO;
import java.util.List;

public interface AppointmentService {
    AppointmentDTO createAppointment(AppointmentDTO dto);
    AppointmentDTO getAppointmentById(Long id);
    List<AppointmentDTO> getAllAppointments();
    List<AppointmentDTO> getAppointmentsByPatientId(Long patientId);
    List<AppointmentDTO> getAppointmentsByDoctorId(Long doctorId);
    AppointmentDTO updateAppointment(Long id, AppointmentDTO dto);
    void cancelAppointment(Long id);
}