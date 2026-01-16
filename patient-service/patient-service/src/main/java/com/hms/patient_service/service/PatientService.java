package com.hms.patient_service.service;

import com.hms.patient_service.dto.PatientDTO;

import java.util.List;

public interface PatientService {

    PatientDTO createPatient(PatientDTO patientDTO);
    List<PatientDTO> getAllPatients();
    PatientDTO getPatientById(Long id);
    PatientDTO updatePatient(Long id, PatientDTO patientDTO);
    void deletePatient(Long id);
    List<PatientDTO> getPatientsByName(String name);
}
