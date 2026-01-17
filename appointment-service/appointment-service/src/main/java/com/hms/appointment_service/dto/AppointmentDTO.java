package com.hms.appointment_service.dto;

import com.hms.appointment_service.model.AppointmentStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AppointmentDTO {
    private Long id;
    private Long patientId;
    private Long doctorId;
    private LocalDateTime appointmentTime;
    private String reasonForVisit;
    private AppointmentStatus status;
}