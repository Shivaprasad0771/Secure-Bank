package com.banking.service;

import com.banking.dto.account.AccountResponse;
import com.banking.dto.transaction.TransactionResponse;
import com.banking.dto.user.UserProfileResponse;
import com.banking.entity.*;
import com.banking.exception.ResourceNotFoundException;
import com.banking.repository.*;
import lombok.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final UserService userService;
    private final AccountService accountService;
    private final TransactionService transactionService;

    public Page<UserProfileResponse> getAllUsers(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<User> users;
        if (search != null && !search.isBlank()) {
            users = userRepository.findAll(pageable);
            List<UserProfileResponse> filtered = users.getContent().stream()
                    .filter(u -> u.getFullName().toLowerCase().contains(search.toLowerCase())
                            || u.getEmail().toLowerCase().contains(search.toLowerCase()))
                    .map(userService::mapToResponse)
                    .collect(Collectors.toList());
            return new PageImpl<>(filtered, pageable, filtered.size());
        }
        return userRepository.findAll(pageable).map(userService::mapToResponse);
    }

    public Page<AccountResponse> getAllAccounts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return accountRepository.findAll(pageable).map(accountService::mapToResponse);
    }

    public Page<TransactionResponse> getAllTransactions(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return transactionRepository.findAll(pageable).map(transactionService::mapToResponse);
    }

    @Transactional
    public UserProfileResponse toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        user.setEnabled(!user.getEnabled());
        return userService.mapToResponse(userRepository.save(user));
    }

    public DashboardStats getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalAccounts = accountRepository.count();
        long totalTransactions = transactionRepository.count();
        return new DashboardStats(totalUsers, totalAccounts, totalTransactions);
    }

    @Data
    @AllArgsConstructor
    public static class DashboardStats {
        private long totalUsers;
        private long totalAccounts;
        private long totalTransactions;
    }
}
