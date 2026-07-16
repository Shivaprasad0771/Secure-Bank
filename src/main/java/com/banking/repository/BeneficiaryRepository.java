package com.banking.repository;

import com.banking.entity.Beneficiary;
import com.banking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BeneficiaryRepository extends JpaRepository<Beneficiary, Long> {
    List<Beneficiary> findByUser(User user);
    Optional<Beneficiary> findByIdAndUser(Long id, User user);
    boolean existsByUserAndAccountNumber(User user, String accountNumber);
}
