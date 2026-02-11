package com.hms.medical_record_service.service;

import com.hms.medical_record_service.dto.MedicalRecordDTO;
import java.util.List;

public interface MedicalRecordService {
    MedicalRecordDTO createRecord(MedicalRecordDTO dto);

    MedicalRecordDTO getRecordById(Long id);

    MedicalRecordDTO getRecordByAppointmentId(Long appointmentId);

    List<MedicalRecordDTO> getPatientHistory(Long patientId);

    List<MedicalRecordDTO> getDoctorRecords(Long doctorId);

    MedicalRecordDTO updateRecord(Long id, MedicalRecordDTO dto);

    void deleteRecord(Long id);
}