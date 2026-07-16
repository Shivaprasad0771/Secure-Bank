package com.banking.dto.beneficiary;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BeneficiaryResponse {
    private Long id;
    private String beneficiaryName;
    private String accountNumber;
    private String bankName;
}
