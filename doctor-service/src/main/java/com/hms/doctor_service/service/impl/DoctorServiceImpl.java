package com.hms.doctor_service.service.impl;

import com.hms.doctor_service.dto.DoctorDTO;
import com.hms.doctor_service.exception.ResourceNotFoundException; // Copy this file from Patient Service!
import com.hms.doctor_service.model.Doctor;
import com.hms.doctor_service.repository.DoctorRepository;
import com.hms.doctor_service.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository repository;

    @Override
    public DoctorDTO createDoctor(DoctorDTO dto) {
        Doctor doctor = new Doctor();
        doctor.setName(dto.getName());
        doctor.setPhoneNumber(dto.getPhoneNumber());
        doctor.setEmail(dto.getEmail());
        doctor.setSpecialization(dto.getSpecialization());
        doctor.setIsAvailable(dto.getIsAvailable());

        Doctor savedDoctor = repository.save(doctor);
        return mapToDTO(savedDoctor);
    }

    @Override
    public List<DoctorDTO> getAllDoctors() {
        return repository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DoctorDTO getDoctorById(Long id) {
        Doctor doctor = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + id));
        return mapToDTO(doctor);
    }

    @Override
    public DoctorDTO updateDoctor(Long id, DoctorDTO dto) {
        Doctor existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + id));

        existing.setName(dto.getName());
        existing.setPhoneNumber(dto.getPhoneNumber());
        existing.setEmail(dto.getEmail());
        existing.setSpecialization(dto.getSpecialization());

        Doctor updated = repository.save(existing);
        return mapToDTO(updated);
    }

    @Override
    public DoctorDTO updateAvailability(Long id, Boolean isAvailable) {
        Doctor existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + id));

        existing.setIsAvailable(isAvailable);
        Doctor updated = repository.save(existing);
        return mapToDTO(updated);
    }

    @Override
    public void deleteDoctor(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Doctor not found with ID: " + id);
        }
        repository.deleteById(id);
    }

    private DoctorDTO mapToDTO(Doctor doctor) {
        DoctorDTO dto = new DoctorDTO();
        dto.setId(doctor.getId());
        dto.setName(doctor.getName());
        dto.setPhoneNumber(doctor.getPhoneNumber());
        dto.setEmail(doctor.getEmail());
        dto.setSpecialization(doctor.getSpecialization());
        dto.setIsAvailable(doctor.getIsAvailable());
        dto.setCreatedAt(doctor.getCreatedAt());
        dto.setUpdatedAt(doctor.getUpdatedAt());
        return dto;
    }
}