package com.hms.patient_service.repository;


import com.hms.patient_service.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient,Long> {

    List<Patient> findByFirstNameContaining(String name);
    Optional<Patient> findByEmail(String email);
}
