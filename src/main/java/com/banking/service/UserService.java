package com.banking.service;

import com.banking.dto.user.*;
import com.banking.entity.User;
import com.banking.exception.*;
import com.banking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserProfileResponse getProfile(String email) {
        User user = getUser(email);
        return mapToResponse(user);
    }

    @Transactional
    public UserProfileResponse updateProfile(UpdateProfileRequest request, String email) {
        User user = getUser(email);
        user.setFullName(request.getFullName());
        user.setPhoneNumber(request.getPhoneNumber());
        return mapToResponse(userRepository.save(user));
    }

    @Transactional
    public void changePassword(ChangePasswordRequest request, String email) {
        User user = getUser(email);
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BankingException("Current password is incorrect", HttpStatus.BAD_REQUEST);
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    public UserProfileResponse mapToResponse(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole().name())
                .enabled(user.getEnabled())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
