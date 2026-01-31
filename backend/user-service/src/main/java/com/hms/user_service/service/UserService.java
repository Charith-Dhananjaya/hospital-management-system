package com.hms.user_service.service;

import com.hms.user_service.dto.LoginRequest;
import com.hms.user_service.dto.LoginResponse;
import com.hms.user_service.dto.UserDTO;
import com.hms.user_service.dto.UserResponse;

public interface UserService {
    UserResponse registerUser(UserDTO userDTO);

    LoginResponse login(LoginRequest loginRequest);
}