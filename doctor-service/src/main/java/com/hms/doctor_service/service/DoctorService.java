package com.hms.doctor_service.service;

import com.hms.doctor_service.dto.DoctorDTO;
import java.util.List;

public interface DoctorService {
    DoctorDTO createDoctor(DoctorDTO doctorDTO);
    List<DoctorDTO> getAllDoctors();
    DoctorDTO getDoctorById(Long id);
    DoctorDTO updateDoctor(Long id, DoctorDTO doctorDTO);
    DoctorDTO updateAvailability(Long id, Boolean isAvailable);
    void deleteDoctor(Long id);
}