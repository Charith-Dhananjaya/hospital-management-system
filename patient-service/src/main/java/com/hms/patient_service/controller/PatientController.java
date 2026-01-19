package com.hms.patient_service.controller;

import com.hms.patient_service.dto.PatientDTO;
import com.hms.patient_service.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @PostMapping
    public PatientDTO create(@RequestBody PatientDTO dto) {
        return patientService.createPatient(dto);
    }

    @GetMapping
    public List<PatientDTO> getAll() {
        return patientService.getAllPatients();
    }

    @GetMapping("/{id}")
    public PatientDTO getById(@PathVariable Long id) {
        return patientService.getPatientById(id);
    }

    @PutMapping("/{id}")
    public PatientDTO update(@PathVariable Long id, @RequestBody PatientDTO dto) {
        return patientService.updatePatient(id, dto);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        patientService.deletePatient(id);
        return "Patient deleted successfully";
    }

    @GetMapping("/search")
    public List<PatientDTO> getByName(@RequestParam String name) {
        return patientService.getPatientsByName(name);
    }
}