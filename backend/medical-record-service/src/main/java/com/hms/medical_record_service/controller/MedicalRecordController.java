package com.hms.medical_record_service.controller;

import com.hms.medical_record_service.dto.MedicalRecordDTO;
import com.hms.medical_record_service.service.MedicalRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
@RequiredArgsConstructor
public class MedicalRecordController {

    private final MedicalRecordService service;

    @PostMapping
    public MedicalRecordDTO create(@RequestBody MedicalRecordDTO dto) {
        return service.createRecord(dto);
    }

    @GetMapping("/{id}")
    public MedicalRecordDTO getById(@PathVariable Long id) {
        return service.getRecordById(id);
    }

    @GetMapping("/appointment/{appointmentId}")
    public MedicalRecordDTO getByAppointmentId(@PathVariable Long appointmentId) {
        return service.getRecordByAppointmentId(appointmentId);
    }

    @GetMapping("/patient/{patientId}")
    public List<MedicalRecordDTO> getPatientHistory(@PathVariable Long patientId) {
        return service.getPatientHistory(patientId);
    }

    @GetMapping("/doctor/{doctorId}")
    public List<MedicalRecordDTO> getDoctorRecords(@PathVariable Long doctorId) {
        return service.getDoctorRecords(doctorId);
    }

    @PutMapping("/{id}")
    public MedicalRecordDTO update(@PathVariable Long id, @RequestBody MedicalRecordDTO dto) {
        return service.updateRecord(id, dto);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        service.deleteRecord(id);
        return "Record deleted successfully";
    }
}