package com.hms.medical_record_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "DOCTOR-SERVICE")
public interface DoctorClient {
    @GetMapping("/api/doctors/{id}")
    Object getDoctorById(@PathVariable("id") Long id);
}