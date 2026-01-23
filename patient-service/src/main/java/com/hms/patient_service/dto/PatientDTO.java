package com.hms.patient_service.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PatientDTO {

    private Long id;

    private String firstName;

    private String lastName;

    private int age;

    private String email;

    private String phoneNumber;

    private String address;

    private String medicalHistory;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
