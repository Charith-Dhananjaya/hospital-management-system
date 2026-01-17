package com.hms.doctor_service.repository;

import com.hms.doctor_service.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    List<Doctor> findByIsAvailableTrue();
}