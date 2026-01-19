package com.hms.patient_service.service.impl;

import com.hms.patient_service.dto.PatientDTO;
import com.hms.patient_service.exception.ResourceNotFoundException;
import com.hms.patient_service.model.Patient;
import com.hms.patient_service.repository.PatientRepository;
import com.hms.patient_service.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;

    @Override
    public PatientDTO createPatient(PatientDTO patientDTO) {
        Patient patient = new Patient();
        patient.setFirstName(patientDTO.getFirstName());
        patient.setLastName(patientDTO.getLastName());
        patient.setEmail(patientDTO.getEmail());
        patient.setPhoneNumber(patientDTO.getPhoneNumber());
        patient.setAddress(patientDTO.getAddress());

        Patient savedPatient = patientRepository.save(patient);

        return mapToDTO(savedPatient);
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
        return mapToDTO(patient);
    }

    @Override
    public PatientDTO updatePatient(Long id, PatientDTO patientDTO) {
        Patient existing = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with ID: " + id));

        existing.setFirstName(patientDTO.getFirstName());
        existing.setLastName(patientDTO.getLastName());
        existing.setEmail(patientDTO.getEmail());
        existing.setPhoneNumber(patientDTO.getPhoneNumber());
        existing.setAddress(patientDTO.getAddress());

        Patient updated = patientRepository.save(existing);
        return mapToDTO(updated);
    }

    @Override
    public void deletePatient(Long id) {
        if (!patientRepository.existsById(id)) {
            throw new ResourceNotFoundException("Patient not found with ID: " + id);
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
        dto.setEmail(patient.getEmail());
        dto.setPhoneNumber(patient.getPhoneNumber());
        dto.setAddress(patient.getAddress());
        dto.setCreatedAt(patient.getCreatedAt());
        dto.setUpdatedAt(patient.getUpdatedAt());
        return dto;
    }
}
