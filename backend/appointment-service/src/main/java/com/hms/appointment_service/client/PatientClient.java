package com.hms.appointment_service.client;

import com.hms.appointment_service.dto.PatientDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

// name = "PATIENT-SERVICE" must match the name on Eureka Dashboard
@FeignClient(name = "PATIENT-SERVICE", configuration = com.hms.appointment_service.config.FeignConfig.class)
public interface PatientClient {
    @GetMapping("/api/patients/{id}")
    PatientDTO getPatientById(@PathVariable("id") Long id);
}