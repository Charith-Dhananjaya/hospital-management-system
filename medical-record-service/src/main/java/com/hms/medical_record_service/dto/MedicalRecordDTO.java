package com.hms.medical_record_service.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MedicalRecordDTO {
    private Long id;
    private Long appointmentId;
    private Long patientId;
    private Long doctorId;
    private String diagnosis;
    private String prescription;
    private String doctorNotes;
    private LocalDateTime createdAt;
}