package com.banking.service;

import com.banking.dto.beneficiary.*;
import com.banking.entity.*;
import com.banking.exception.*;
import com.banking.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BeneficiaryService {

    private final BeneficiaryRepository beneficiaryRepository;
    private final UserRepository userRepository;

    public List<BeneficiaryResponse> getBeneficiaries(String email) {
        User user = getUser(email);
        return beneficiaryRepository.findByUser(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public BeneficiaryResponse addBeneficiary(BeneficiaryRequest request, String email) {
        User user = getUser(email);

        if (beneficiaryRepository.existsByUserAndAccountNumber(user, request.getAccountNumber())) {
            throw new BankingException("Beneficiary with this account number already exists", HttpStatus.CONFLICT);
        }

        Beneficiary beneficiary = Beneficiary.builder()
                .beneficiaryName(request.getBeneficiaryName())
                .accountNumber(request.getAccountNumber())
                .bankName(request.getBankName())
                .user(user)
                .build();

        beneficiary = beneficiaryRepository.save(beneficiary);
        return mapToResponse(beneficiary);
    }

    @Transactional
    public void deleteBeneficiary(Long id, String email) {
        User user = getUser(email);
        Beneficiary beneficiary = beneficiaryRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Beneficiary not found with id: " + id));
        beneficiaryRepository.delete(beneficiary);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    private BeneficiaryResponse mapToResponse(Beneficiary b) {
        return BeneficiaryResponse.builder()
                .id(b.getId())
                .beneficiaryName(b.getBeneficiaryName())
                .accountNumber(b.getAccountNumber())
                .bankName(b.getBankName())
                .build();
    }
}
