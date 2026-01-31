package com.hms.notification_service.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentBookedEvent {
    private Long appointmentId;
    private String patientEmail;
    private String message;
}