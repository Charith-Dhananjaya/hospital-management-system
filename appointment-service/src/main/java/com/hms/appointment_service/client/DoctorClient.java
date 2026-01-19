package com.hms.appointment_service.client;

import com.hms.appointment_service.dto.DoctorDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

// name = "DOCTOR-SERVICE" must match the name on Eureka Dashboard
@FeignClient(name = "DOCTOR-SERVICE")
public interface DoctorClient {

    @GetMapping("/api/doctors/{id}")
    DoctorDTO getDoctorById(@PathVariable("id") Long id);
}