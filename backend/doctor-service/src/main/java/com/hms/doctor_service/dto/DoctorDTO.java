package com.hms.doctor_service.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DoctorDTO {

    private Long id;
    private String name;
    private String phoneNumber;
    private String email;
    private String specialization;
    private String qualifications;
    private double consultationFee;
    private Boolean isAvailable;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}