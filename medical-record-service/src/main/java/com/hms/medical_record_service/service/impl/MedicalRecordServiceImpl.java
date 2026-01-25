package com.hms.medical_record_service.service.impl;

import com.hms.medical_record_service.client.DoctorClient;
import com.hms.medical_record_service.client.PatientClient;
import com.hms.medical_record_service.dto.MedicalRecordDTO;
import com.hms.medical_record_service.exception.ResourceNotFoundException;
import com.hms.medical_record_service.model.MedicalRecord;
import com.hms.medical_record_service.repository.MedicalRecordRepository;
import com.hms.medical_record_service.service.MedicalRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicalRecordServiceImpl implements MedicalRecordService {

    private final MedicalRecordRepository repository;
    private final PatientClient patientClient;
    private final DoctorClient doctorClient;

    @Override
    public MedicalRecordDTO createRecord(MedicalRecordDTO dto) {

        try {
            patientClient.getPatientById(dto.getPatientId());
        } catch (Exception e) {
            throw new ResourceNotFoundException("Patient not found with ID: " + dto.getPatientId());
        }


        try {
            doctorClient.getDoctorById(dto.getDoctorId());
        } catch (Exception e) {
            throw new ResourceNotFoundException("Doctor not found with ID: " + dto.getDoctorId());
        }

        MedicalRecord record = new MedicalRecord();
        record.setAppointmentId(dto.getAppointmentId());
        record.setPatientId(dto.getPatientId());
        record.setDoctorId(dto.getDoctorId());
        record.setDiagnosis(dto.getDiagnosis());
        record.setPrescription(dto.getPrescription());
        record.setDoctorNotes(dto.getDoctorNotes());

        return mapToDTO(repository.save(record));
    }

    @Override
    public MedicalRecordDTO getRecordById(Long id) {
        MedicalRecord record = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medical Record not found with ID: " + id));
        return mapToDTO(record);
    }

    @Override
    public List<MedicalRecordDTO> getPatientHistory(Long patientId) {

        try {
            patientClient.getPatientById(patientId);
        } catch (Exception e) {

            throw new ResourceNotFoundException("Patient not found with ID: " + patientId);
        }


        return repository.findByPatientId(patientId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<MedicalRecordDTO> getDoctorRecords(Long doctorId) {
        return repository.findByDoctorId(doctorId).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public MedicalRecordDTO updateRecord(Long id, MedicalRecordDTO dto) {
        MedicalRecord existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medical Record not found with ID: " + id));

        existing.setDiagnosis(dto.getDiagnosis());
        existing.setPrescription(dto.getPrescription());
        existing.setDoctorNotes(dto.getDoctorNotes());

        return mapToDTO(repository.save(existing));
    }

    @Override
    public void deleteRecord(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Medical Record not found with ID: " + id);
        }
        repository.deleteById(id);
    }

    private MedicalRecordDTO mapToDTO(MedicalRecord record) {
        MedicalRecordDTO dto = new MedicalRecordDTO();
        dto.setId(record.getId());
        dto.setAppointmentId(record.getAppointmentId());
        dto.setPatientId(record.getPatientId());
        dto.setDoctorId(record.getDoctorId());
        dto.setDiagnosis(record.getDiagnosis());
        dto.setPrescription(record.getPrescription());
        dto.setDoctorNotes(record.getDoctorNotes());
        dto.setCreatedAt(record.getCreatedAt());
        return dto;
    }
}