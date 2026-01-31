package com.hms.api_gateway.model;

public record AppointmentResponse(
        Long id,
        String appointmentTime,
        String reasonForVisit,
        Patient patient,
        Doctor doctor
) {}