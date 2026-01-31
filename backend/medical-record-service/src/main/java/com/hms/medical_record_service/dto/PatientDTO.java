package com.hms.medical_record_service.dto;

import lombok.Data;

@Data
public class PatientDTO {
    private Long id;
    private String firstName;
    private String email;
}