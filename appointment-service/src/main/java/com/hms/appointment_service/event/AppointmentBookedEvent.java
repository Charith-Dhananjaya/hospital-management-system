package com.hms.appointment_service.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentBookedEvent {
    private Long appointmentId;
    private String patientEmail; // Ideally we get this from Patient Service
    private String message;
}