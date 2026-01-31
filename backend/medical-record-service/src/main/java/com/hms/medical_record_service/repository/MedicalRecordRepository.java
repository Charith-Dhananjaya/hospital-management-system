package com.hms.medical_record_service.repository;

import com.hms.medical_record_service.model.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    List<MedicalRecord> findByPatientId(Long patientId);

    List<MedicalRecord> findByDoctorId(Long doctorId);

    List<MedicalRecord> findByAppointmentId(Long appointmentId);
}