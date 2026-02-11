package com.hms.api_gateway.filter;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouteValidator {

        public static final List<String> openApiEndpoints = List.of(
                        "/auth/register",
                        "/auth/login",
                        "/auth/health",
                        "/eureka");

        public Predicate<ServerHttpRequest> isSecured = request -> {
                String path = request.getURI().getPath();
                String method = request.getMethod().name();

                // Public endpoints in Doctor Service (GET only)
                if (path.startsWith("/api/doctors") && method.equals("GET")) {
                        // /my-profile MUST remain secured
                        if (path.contains("/my-profile")) {
                                return true;
                        }
                        return false; // Allow public access to other GET endpoints (getAll, getById, etc.)
                }

                return openApiEndpoints
                                .stream()
                                .noneMatch(uri -> path.contains(uri));
        };
}