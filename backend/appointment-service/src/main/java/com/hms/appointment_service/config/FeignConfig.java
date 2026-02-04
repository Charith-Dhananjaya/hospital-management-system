package com.hms.appointment_service.config;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * Feign configuration to forward authentication headers to downstream services.
 * This ensures that when Appointment Service calls Doctor/Patient services,
 * the user context headers are passed along.
 */
@Configuration
public class FeignConfig {

    @Bean
    public RequestInterceptor requestInterceptor() {
        return new RequestInterceptor() {
            @Override
            public void apply(RequestTemplate template) {
                ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder
                        .getRequestAttributes();
                if (attributes != null) {
                    HttpServletRequest request = attributes.getRequest();

                    // Forward authentication headers
                    String userEmail = request.getHeader("X-User-Email");
                    String userRole = request.getHeader("X-User-Role");

                    if (userEmail != null) {
                        template.header("X-User-Email", userEmail);
                    }
                    if (userRole != null) {
                        template.header("X-User-Role", userRole);
                    }
                }
            }
        };
    }
}
