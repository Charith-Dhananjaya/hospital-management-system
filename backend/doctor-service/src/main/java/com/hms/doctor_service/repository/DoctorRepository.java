package com.hms.doctor_service.repository;

import com.hms.doctor_service.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    Optional<Doctor> findByEmail(String email);
    List<Doctor> findByIsAvailable(boolean isAvailable);
    List<Doctor> findBySpecializationIgnoreCase(String specialization);
}