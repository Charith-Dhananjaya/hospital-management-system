package com.hms.doctor_service.service.impl;

import com.hms.doctor_service.dto.DoctorDTO;
import com.hms.doctor_service.exception.ResourceNotFoundException; // Copy this file from Patient Service!
import com.hms.doctor_service.model.Doctor;
import com.hms.doctor_service.repository.DoctorRepository;
import com.hms.doctor_service.security.UserContext;
import com.hms.doctor_service.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;
    private final UserContext userContext;

    @Override
    public DoctorDTO createDoctor(DoctorDTO dto) {
        if (userContext.isDoctor()) {
            if (!dto.getEmail().equals(userContext.getLoggedInEmail())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: You cannot create a profile for another email.");
            }
        } else if (!userContext.isAdmin()) {

            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: Only Doctors and Admins can create doctor profiles.");
        }

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
        if (!userContext.isAdmin()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: Only Admins can view the full doctor list.");
        }
        return doctorRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DoctorDTO getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + id));

        if (userContext.isAdmin()) {
            return mapToDTO(doctor);
        }

        if (userContext.isDoctor()) {
            if (!doctor.getEmail().equals(userContext.getLoggedInEmail())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: You can only view your own profile.");
            }
            return mapToDTO(doctor);
        }

        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: You are not authorized to view this profile ID directly.");
    }

    @Override
    public DoctorDTO updateDoctor(Long id, DoctorDTO dto) {
        Doctor existing = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + id));

        validateOwnership(existing);
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

        validateOwnership(existing);
        existing.setIsAvailable(isAvailable);
        Doctor updated = doctorRepository.save(existing);
        return mapToDTO(updated);
    }

    @Override
    public void deleteDoctor(Long id) {
        if (!userContext.isAdmin()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: Only Admins can delete doctor profiles.");
        }

        if (!doctorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Doctor not found with ID: " + id);
        }
        doctorRepository.deleteById(id);
    }

    @Override
    public List<DoctorDTO> getDoctorsBySpecialization(String specialization) {

        List<Doctor> doctors = doctorRepository.findBySpecializationIgnoreCase(specialization);

        if (doctors.isEmpty()) {
            throw new ResourceNotFoundException("No doctors found for specialization: " + specialization);
        }

        return doctors.stream()
                .map(this::mapToPublicDTO)
                .toList();
    }

    @Override
    public List<DoctorDTO> getDoctorsByAvailability(boolean status) {

        List<Doctor> doctors = doctorRepository.findByIsAvailable(status);

        if (doctors.isEmpty()) {
            throw new ResourceNotFoundException("No doctors found for status: " + status);
        }
        return doctors.stream()
                .map(this::mapToPublicDTO)
                .toList();
    }

    @Override
    public DoctorDTO getDoctorByEmail(String email) {
        Doctor doctor = doctorRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found for email: " + email));

        validateOwnership(doctor);
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

    private DoctorDTO mapToPublicDTO(Doctor doctor) {
        DoctorDTO dto = new DoctorDTO();
        dto.setId(doctor.getId());
        dto.setName(doctor.getName());
        dto.setSpecialization(doctor.getSpecialization());
        dto.setQualifications(doctor.getQualifications());
        dto.setConsultationFee(doctor.getConsultationFee());
        dto.setIsAvailable(doctor.getIsAvailable());

        return dto;
    }

    private void validateOwnership(Doctor doctor) {
        if (userContext.isAdmin()) return;

        if (userContext.isDoctor()) {
            if (!doctor.getEmail().equals(userContext.getLoggedInEmail())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: You can only modify your own profile.");
            }
        } else {

            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied.");
        }
    }
}