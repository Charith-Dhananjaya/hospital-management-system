package com.hms.api_gateway.controller;

import com.hms.api_gateway.model.AppointmentResponse;
import com.hms.api_gateway.model.Doctor;
import com.hms.api_gateway.model.Patient;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.client.RestTemplate;

@Controller
public class AppointmentController {

    private final RestTemplate restTemplate;

    public AppointmentController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @QueryMapping
    public AppointmentResponse appointmentById(@Argument Long id) {

        // 1. Get Appointment Data
        // Call: http://APPOINTMENT-SERVICE/api/appointments/{id}
        AppointmentRaw appointment = restTemplate.getForObject(
                "http://appointment-service/api/appointments/" + id,
                AppointmentRaw.class
        );

        if (appointment == null) throw new RuntimeException("Appointment not found!");

        // 2. Get Patient Data
        // Call: http://PATIENT-SERVICE/api/patients/{id}
        Patient patient = restTemplate.getForObject(
                "http://patient-service/api/patients/" + appointment.patientId(),
                Patient.class
        );

        // 3. Get Doctor Data
        // Call: http://DOCTOR-SERVICE/api/doctors/{id}
        Doctor doctor = restTemplate.getForObject(
                "http://doctor-service/api/doctors/" + appointment.doctorId(),
                Doctor.class
        );

        return new AppointmentResponse(
                appointment.id(),
                appointment.appointmentTime(),
                appointment.reasonForVisit(),
                patient,
                doctor
        );
    }

    record AppointmentRaw(Long id, Long patientId, Long doctorId, String appointmentTime, String reasonForVisit) {}
}