package com.hms.doctor_service.controller;

import com.hms.doctor_service.dto.DoctorDTO;
import com.hms.doctor_service.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;

    @PostMapping("/my-profile")
    public DoctorDTO createProfile(@RequestBody DoctorDTO doctorDTO,
                                   @RequestHeader("X-User-Email") String email) {
        doctorDTO.setEmail(email);
        return doctorService.createDoctor(doctorDTO);
    }


    @GetMapping("/my-profile")
    public DoctorDTO getMyProfile(@RequestHeader("X-User-Email") String email) {
        return doctorService.getDoctorByEmail(email);
    }

    @GetMapping
    public List<DoctorDTO> getAllDoctors() {
        return doctorService.getAllDoctors();
    }

    @GetMapping("/{id}")
    public DoctorDTO getDoctorById(@PathVariable Long id) {
        return doctorService.getDoctorById(id);
    }

    @PutMapping("/{id}")
    public DoctorDTO updateDoctor(@PathVariable Long id, @RequestBody DoctorDTO doctorDTO) {
        return doctorService.updateDoctor(id, doctorDTO);
    }

    // /api/doctors/1/availability?status=true
    @PatchMapping("/{id}/availability")
    public DoctorDTO updateAvailability(@PathVariable Long id, @RequestParam Boolean status) {
        return doctorService.updateAvailability(id, status);
    }

    @GetMapping("/availability")
    public List<DoctorDTO> getDoctorsByAvailability(@RequestParam Boolean status) {
        return doctorService.getDoctorsByAvailability(status);
    }

    @GetMapping("/specialization")
    public List<DoctorDTO> getDoctorsBySpecialization(@RequestParam String specialization) {
        return doctorService.getDoctorsBySpecialization(specialization);
    }

    @DeleteMapping("/{id}")
    public String deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return "Doctor deleted successfully";
    }
}