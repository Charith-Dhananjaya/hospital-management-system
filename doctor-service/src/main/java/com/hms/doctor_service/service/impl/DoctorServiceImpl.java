package com.hms.doctor_service.service.impl;

import com.hms.doctor_service.dto.DoctorDTO;
import com.hms.doctor_service.exception.ResourceNotFoundException; // Copy this file from Patient Service!
import com.hms.doctor_service.model.Doctor;
import com.hms.doctor_service.repository.DoctorRepository;
import com.hms.doctor_service.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;

    @Override
    public DoctorDTO createDoctor(DoctorDTO dto) {
        Optional<Doctor> existingDoctor = doctorRepository.findByEmail(dto.getEmail());
        if (existingDoctor.isPresent()) {
            throw new RuntimeException("Doctor already exists with email: " + dto.getEmail());
        }
        Doctor doctor = new Doctor();
        doctor.setName(dto.getName());
        doctor.setPhoneNumber(dto.getPhoneNumber());
        doctor.setEmail(dto.getEmail());
        doctor.setSpecialization(dto.getSpecialization());
        doctor.setQualifications(dto.getQualifications());
        doctor.setConsultationFee(dto.getConsultationFee());
        doctor.setIsAvailable(dto.getIsAvailable());

        Doctor savedDoctor = doctorRepository.save(doctor);
        return mapToDTO(savedDoctor);
    }

    @Override
    public List<DoctorDTO> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DoctorDTO getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + id));
        return mapToDTO(doctor);
    }

    @Override
    public DoctorDTO updateDoctor(Long id, DoctorDTO dto) {
        Doctor existing = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + id));

        existing.setName(dto.getName());
        existing.setPhoneNumber(dto.getPhoneNumber());
        existing.setEmail(dto.getEmail());
        existing.setSpecialization(dto.getSpecialization());
        existing.setQualifications(dto.getQualifications());
        existing.setConsultationFee(dto.getConsultationFee());

        Doctor updated = doctorRepository.save(existing);
        return mapToDTO(updated);
    }

    @Override
    public DoctorDTO updateAvailability(Long id, Boolean isAvailable) {
        Doctor existing = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + id));

        existing.setIsAvailable(isAvailable);
        Doctor updated = doctorRepository.save(existing);
        return mapToDTO(updated);
    }

    @Override
    public void deleteDoctor(Long id) {
        if (!doctorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Doctor not found with ID: " + id);
        }
        doctorRepository.deleteById(id);
    }

    @Override
    public List<DoctorDTO> getDoctorsBySpecialization(String specialization) {

        List<Doctor> doctors =
                doctorRepository.findBySpecializationIgnoreCase(specialization);

        if (doctors.isEmpty()) {
            throw new ResourceNotFoundException(
                    "No doctors found for specialization: " + specialization
            );
        }

        return doctors.stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Override
    public List<DoctorDTO> getDoctorsByAvailability(boolean status) {
        List<Doctor> doctors = doctorRepository.findByIsAvailable(status);

        return doctors.stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Override
    public DoctorDTO getDoctorByEmail(String email) {
        Doctor doctor = doctorRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found for email: " + email));
        return mapToDTO(doctor);
    }

    private DoctorDTO mapToDTO(Doctor doctor) {
        DoctorDTO dto = new DoctorDTO();
        dto.setId(doctor.getId());
        dto.setName(doctor.getName());
        dto.setPhoneNumber(doctor.getPhoneNumber());
        dto.setEmail(doctor.getEmail());
        dto.setSpecialization(doctor.getSpecialization());
        dto.setQualifications(doctor.getQualifications());
        dto.setConsultationFee(doctor.getConsultationFee());
        dto.setIsAvailable(doctor.getIsAvailable());
        dto.setCreatedAt(doctor.getCreatedAt());
        dto.setUpdatedAt(doctor.getUpdatedAt());
        return dto;
    }
}