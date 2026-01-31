package com.hms.user_service.controller;

import com.hms.user_service.dto.LoginRequest;
import com.hms.user_service.dto.LoginResponse;
import com.hms.user_service.dto.UserDTO;
import com.hms.user_service.dto.UserResponse;
import com.hms.user_service.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public UserResponse register(@RequestBody UserDTO userDTO) {
        return userService.registerUser(userDTO);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest loginRequest) {
        return userService.login(loginRequest);
    }
}