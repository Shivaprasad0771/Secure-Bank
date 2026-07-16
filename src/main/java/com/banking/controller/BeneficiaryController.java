package com.banking.controller;

import com.banking.dto.beneficiary.*;
import com.banking.service.BeneficiaryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/beneficiaries")
@RequiredArgsConstructor
public class BeneficiaryController {

    private final BeneficiaryService beneficiaryService;

    @GetMapping
    public ResponseEntity<List<BeneficiaryResponse>> getBeneficiaries(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(beneficiaryService.getBeneficiaries(userDetails.getUsername()));
    }

    @PostMapping
    public ResponseEntity<BeneficiaryResponse> addBeneficiary(
            @Valid @RequestBody BeneficiaryRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(beneficiaryService.addBeneficiary(request, userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBeneficiary(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        beneficiaryService.deleteBeneficiary(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
