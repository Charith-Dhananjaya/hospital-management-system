package com.hms.medical_record_service.client;

import com.hms.medical_record_service.dto.DoctorDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "DOCTOR-SERVICE")
public interface DoctorClient {
    @GetMapping("/api/doctors/{id}")
    DoctorDTO getDoctorById(@PathVariable("id") Long id);

    @GetMapping("/api/doctors/my-profile")
    DoctorDTO getProfile(@RequestHeader("X-User-Email") String email);
}