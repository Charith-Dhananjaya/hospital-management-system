package com.hms.patient_service.service.impl;

import com.hms.patient_service.dto.PatientDTO;
import com.hms.patient_service.exception.ResourceNotFoundException;
import com.hms.patient_service.model.Patient;
import com.hms.patient_service.repository.PatientRepository;
import com.hms.patient_service.security.UserContext;
import com.hms.patient_service.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;
    private final UserContext userContext;

    @Override
    public PatientDTO createPatient(PatientDTO patientDTO) {

        if (userContext.isAdmin()) {

        } else if (userContext.isPatient()) {
            if (!patientDTO.getEmail().equals(userContext.getLoggedInEmail())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                        "Access Denied: You cannot create a profile for another email.");
            }
        }

        else {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: Doctors cannot create patients.");
        }
        Patient patient = new Patient();
        patient.setFirstName(patientDTO.getFirstName());
        patient.setLastName(patientDTO.getLastName());
        patient.setAge(patientDTO.getAge());
        patient.setEmail(patientDTO.getEmail());
        patient.setPhoneNumber(patientDTO.getPhoneNumber());
        patient.setAddress(patientDTO.getAddress());
        patient.setMedicalHistory(patientDTO.getMedicalHistory());

        Patient savedPatient = patientRepository.save(patient);

        return mapToDTO(savedPatient);
    }

    @Override
    public PatientDTO getPatientByEmail(String email) {
        Patient patient = patientRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found for email: " + email));
        return mapToDTO(patient);
    }

    @Override
    public List<PatientDTO> getAllPatients() {
        List<Patient> patients = patientRepository.findAll();
        return patients.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PatientDTO getPatientById(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with ID: " + id));

        if (userContext.isAdmin())
            return mapToDTO(patient);

        if (userContext.isPatient() && !patient.getEmail().equals(userContext.getLoggedInEmail())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Access Denied: You can only view your own profile.");
        }

        return mapToDTO(patient);
    }

    @Override
    public PatientDTO updatePatient(Long id, PatientDTO patientDTO) {
        Patient existing = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with ID: " + id));

        if (userContext.isPatient() && !existing.getEmail().equals(userContext.getLoggedInEmail())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Access Denied: You can only update your own profile.");
        }

        existing.setFirstName(patientDTO.getFirstName());
        existing.setLastName(patientDTO.getLastName());
        existing.setAge(patientDTO.getAge());
        // existing.setEmail(patientDTO.getEmail()); // Email should not be updatable
        // here
        existing.setPhoneNumber(patientDTO.getPhoneNumber());
        existing.setAddress(patientDTO.getAddress());
        existing.setMedicalHistory(patientDTO.getMedicalHistory());

        Patient updated = patientRepository.save(existing);
        return mapToDTO(updated);
    }

    @Override
    public void deletePatient(Long id) {
        if (!patientRepository.existsById(id)) {
            throw new ResourceNotFoundException("Patient not found with ID: " + id);
        }
        if (!userContext.isAdmin()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: Only Admins can delete patients.");
        }
        patientRepository.deleteById(id);
    }

    @Override
    public List<PatientDTO> getPatientsByName(String name) {
        List<Patient> patients = patientRepository.findByFirstNameContaining(name);
        return patients.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private PatientDTO mapToDTO(Patient patient) {
        PatientDTO dto = new PatientDTO();
        dto.setId(patient.getId());
        dto.setFirstName(patient.getFirstName());
        dto.setLastName(patient.getLastName());
        dto.setAge(patient.getAge());
        dto.setEmail(patient.getEmail());
        dto.setPhoneNumber(patient.getPhoneNumber());
        dto.setAddress(patient.getAddress());
        dto.setMedicalHistory(patient.getMedicalHistory());
        dto.setCreatedAt(patient.getCreatedAt());
        dto.setUpdatedAt(patient.getUpdatedAt());
        return dto;
    }
}
