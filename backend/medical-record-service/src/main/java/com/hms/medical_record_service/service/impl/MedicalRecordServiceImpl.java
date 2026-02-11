package com.hms.medical_record_service.service.impl;

import com.hms.medical_record_service.client.DoctorClient;
import com.hms.medical_record_service.client.PatientClient;
import com.hms.medical_record_service.dto.DoctorDTO;
import com.hms.medical_record_service.dto.MedicalRecordDTO;
import com.hms.medical_record_service.dto.PatientDTO;
import com.hms.medical_record_service.exception.ResourceNotFoundException;
import com.hms.medical_record_service.model.MedicalRecord;
import com.hms.medical_record_service.repository.MedicalRecordRepository;
import com.hms.medical_record_service.security.UserContext;
import com.hms.medical_record_service.service.MedicalRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicalRecordServiceImpl implements MedicalRecordService {

    private final MedicalRecordRepository repository;
    private final PatientClient patientClient;
    private final DoctorClient doctorClient;
    private final UserContext userContext;

    @Override
    public MedicalRecordDTO createRecord(MedicalRecordDTO dto) {

        if (userContext.isPatient()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Patients cannot create medical records.");
        }

        if (dto.getAppointmentId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Appointment ID is required");
        }

        // Prevent duplicates
        if (!repository.findByAppointmentId(dto.getAppointmentId()).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "A medical record already exists for this appointment.");
        }
        if (dto.getPatientId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Patient ID is required");
        }
        if (dto.getDoctorId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Doctor ID is required");
        }

        // Verify patient exists
        try {
            patientClient.getPatientById(dto.getPatientId());
        } catch (Exception e) {
            throw new ResourceNotFoundException("Patient not found with ID: " + dto.getPatientId());
        }

        // Verify doctor exists
        try {
            doctorClient.getDoctorById(dto.getDoctorId());
        } catch (Exception e) {
            throw new ResourceNotFoundException("Doctor not found with ID: " + dto.getDoctorId());
        }

        if (userContext.isDoctor()) {
            String loggedInEmail = userContext.getLoggedInEmail();
            if (loggedInEmail == null) {
                System.out.println("❌ ERROR: Logged in email is null in UserContext");
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User email not found in context");
            }

            // Verify logged in doctor matches the record's doctor ID
            try {
                String role = userContext.getLoggedInRole();
                DoctorDTO loggedInDoctor = doctorClient.getProfile(loggedInEmail, role);
                if (!loggedInDoctor.getId().equals(dto.getDoctorId())) {
                    throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                            "Access Denied: You cannot create records for other doctors.");
                }
            } catch (Exception e) {
                // If we can't fetch profile or ID mismatch
                if (e instanceof ResponseStatusException)
                    throw e;
                System.out.println("❌ ERROR: Failed to verify doctor identity. Email: " + loggedInEmail + ". Error: "
                        + e.getMessage());
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                        "Failed to verify doctor identity: " + e.getMessage(),
                        e);
            }
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

        String email = userContext.getLoggedInEmail();

        if (userContext.isAdmin())
            return mapToDTO(record);

        if (userContext.isPatient()) {
            PatientDTO patient = patientClient.getPatientById(record.getPatientId());
            if (!patient.getEmail().equals(email)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: Not your record.");
            }
        }

        if (userContext.isDoctor()) {
            DoctorDTO doc = doctorClient.getDoctorById(record.getDoctorId());
            if (!doc.getEmail().equals(email)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                        "Access Denied: You did not create this record.");
            }
        }

        return mapToDTO(record);
    }

    @Override
    public MedicalRecordDTO getRecordByAppointmentId(Long appointmentId) {
        List<MedicalRecord> records = repository.findByAppointmentId(appointmentId);
        if (records.isEmpty()) {
            throw new ResourceNotFoundException("Medical Record not found for Appointment ID: " + appointmentId);
        }
        // Assuming one record per appointment
        MedicalRecord record = records.get(0);

        // Add security checks similar to getRecordById if needed,
        // but for now relying on the fact that if you have the appointment ID, you
        // likely have access.
        // Better to be safe: check if user is the doctor or patient of this record.

        String email = userContext.getLoggedInEmail();

        if (userContext.isAdmin())
            return mapToDTO(record);

        if (userContext.isPatient()) {
            try {
                PatientDTO patient = patientClient.getPatientById(record.getPatientId());
                if (!patient.getEmail().equals(email)) {
                    throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: Not your record.");
                }
            } catch (Exception e) {
                // Fallback or ignore if patient service fails, but better to deny if unsure
            }
        }

        if (userContext.isDoctor()) {
            try {
                // To avoid circular dependency or complex checks, just check if doc ID matches
                // We need to fetch doctor to get email
                DoctorDTO doc = doctorClient.getDoctorById(record.getDoctorId());
                if (!doc.getEmail().equals(email)) {
                    throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                            "Access Denied: You did not create this record.");
                }
            } catch (Exception e) {
            }
        }

        return mapToDTO(record);
    }

    @Override
    public List<MedicalRecordDTO> getPatientHistory(Long patientId) {

        if (userContext.isAdmin()) {
            return repository.findByPatientId(patientId).stream()
                    .map(this::mapToDTO).collect(Collectors.toList());
        }

        if (userContext.isPatient()) {
            PatientDTO patient = patientClient.getPatientById(patientId);
            if (!patient.getEmail().equals(userContext.getLoggedInEmail())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                        "Access Denied: You can only view your own history.");
            }
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
        MedicalRecord record = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medical Record not found with ID: " + id));

        if (userContext.isPatient()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Patients cannot update medical records.");
        }

        if (userContext.isDoctor()) {
            DoctorDTO doc = doctorClient.getDoctorById(record.getDoctorId());
            if (!doc.getEmail().equals(userContext.getLoggedInEmail())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                        "Access Denied: You did not create this record.");
            }
        }

        record.setDiagnosis(dto.getDiagnosis());
        record.setPrescription(dto.getPrescription());
        record.setDoctorNotes(dto.getDoctorNotes());

        return mapToDTO(repository.save(record));
    }

    @Override
    public void deleteRecord(Long id) {
        if (!userContext.isAdmin()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: Only Admins can delete records.");
        }

        MedicalRecord record = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medical Record not found with ID: " + id));
        repository.delete(record);
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