package com.hms.appointment_service.security;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserContext {

    private final HttpServletRequest request;

    public String getLoggedInEmail() {
        return request.getHeader("X-User-Email");
    }

    public String getLoggedInRole() {
        return request.getHeader("X-User-Role");
    }

    public boolean isAdmin() {
        return "ADMIN".equals(getLoggedInRole());
    }

    public boolean isPatient() {
        return "PATIENT".equals(getLoggedInRole());
    }

    public boolean isDoctor() {
        return "DOCTOR".equals(getLoggedInRole());
    }
}