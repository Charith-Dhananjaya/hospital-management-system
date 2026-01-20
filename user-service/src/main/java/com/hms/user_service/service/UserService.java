package com.hms.user_service.service;

import com.hms.user_service.dto.UserDTO;
import com.hms.user_service.dto.UserResponse;

public interface UserService {
    UserResponse registerUser(UserDTO userDTO);
}