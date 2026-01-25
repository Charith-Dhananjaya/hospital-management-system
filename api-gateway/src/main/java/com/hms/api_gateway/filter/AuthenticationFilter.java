package com.hms.api_gateway.filter;

import com.hms.api_gateway.util.JwtUtil;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

    private final RouteValidator validator;
    private final JwtUtil jwtUtil;

    public AuthenticationFilter(RouteValidator validator, JwtUtil jwtUtil) {
        super(Config.class);
        this.validator = validator;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            if (validator.isSecured.test(exchange.getRequest())) {


                String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
                if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing Authorization Header");
                }
                String token = authHeader.substring(7);

                try {
                    jwtUtil.validateToken(token);
                    String userEmail = jwtUtil.extractUsername(token);
                    String role = jwtUtil.extractRole(token);

                    String path = exchange.getRequest().getURI().getPath();
                    String method = exchange.getRequest().getMethod().name();

                    // --- RULE 1: PATIENT ROUTES (/api/patients) ---
                    if (path.contains("/api/patients")) {
                        // Scenario A: Patients (Can do anything: GET, PUT, etc.)
                        if (role.equals("PATIENT")) {
                            // Allowed
                        }
                        // Scenario B: Doctors (Can only VIEW/GET patient data)
                        // ✅ This fixes your issue!
                        else if (role.equals("DOCTOR") && method.equals("GET")) {
                            // Allowed (Read-Only)
                        }
                        // Scenario C: Everyone else (or Doctors trying to Edit)
                        else {
                            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: Patients Only (Doctors can View)");
                        }
                    }

                    // --- RULE 2: DOCTOR ROUTES (/api/doctors) ---
                    if (path.contains("/api/doctors")) {
                        // Allow searching (GET) for everyone, but Editing is Doctor only
                        if (method.equals("GET")) {

                        } else {
                            if (!role.equals("DOCTOR")) {
                                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: Doctors Only");
                            }
                        }
                    }

                    // --- RULE 3: APPOINTMENTS ---
                    // Only Patients can BOOK (POST) appointments
                    if (path.contains("/api/appointments") && method.equals("POST")) {
                        if (!role.equals("PATIENT")) {
                            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: Only Patients can book appointments");
                        }
                    }

                    ServerHttpRequest request = exchange.getRequest()
                            .mutate()
                            .header("X-User-Email", userEmail)
                            .header("X-User-Role", role)
                            .build();

                    return chain.filter(exchange.mutate().request(request).build());

                } catch (Exception e) {
                    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Token or Access Denied");
                }
            }
            return chain.filter(exchange);
        };
    }

    public static class Config { }
}
