package com.banking.dto.beneficiary;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class BeneficiaryRequest {

    @NotBlank(message = "Beneficiary name is required")
    private String beneficiaryName;

    @NotBlank(message = "Account number is required")
    private String accountNumber;

    private String bankName;
}
