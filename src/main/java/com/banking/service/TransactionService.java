package com.banking.service;

import com.banking.dto.transaction.*;
import com.banking.entity.*;
import com.banking.exception.*;
import com.banking.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    @Transactional
    public TransactionResponse transfer(TransferRequest request, String userEmail) {
        if (request.getSenderAccountNumber().equals(request.getReceiverAccountNumber())) {
            throw new BankingException("Sender and receiver cannot be the same account", HttpStatus.BAD_REQUEST);
        }

        Account sender = accountRepository.findByAccountNumber(request.getSenderAccountNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Sender account not found"));

        // Verify ownership
        if (!sender.getUser().getEmail().equals(userEmail)) {
            throw new BankingException("Unauthorized: You don't own this sender account", HttpStatus.FORBIDDEN);
        }

        Account receiver = accountRepository.findByAccountNumber(request.getReceiverAccountNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Receiver account not found"));

        if (sender.getStatus() != Account.AccountStatus.ACTIVE) {
            throw new BankingException("Sender account is inactive", HttpStatus.BAD_REQUEST);
        }
        if (receiver.getStatus() != Account.AccountStatus.ACTIVE) {
            throw new BankingException("Receiver account is inactive", HttpStatus.BAD_REQUEST);
        }

        BigDecimal amount = request.getAmount();
        if (sender.getBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException("Insufficient balance. Available: " + sender.getBalance());
        }

        sender.setBalance(sender.getBalance().subtract(amount));
        receiver.setBalance(receiver.getBalance().add(amount));
        accountRepository.save(sender);
        accountRepository.save(receiver);

        Transaction transaction = Transaction.builder()
                .transactionReference(UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase())
                .transactionType(Transaction.TransactionType.TRANSFER)
                .amount(amount)
                .senderAccount(sender)
                .receiverAccount(receiver)
                .description(request.getDescription())
                .status(Transaction.TransactionStatus.COMPLETED)
                .build();

        transaction = transactionRepository.save(transaction);
        return mapToResponse(transaction);
    }

    @Transactional
    public TransactionResponse deposit(DepositRequest request, String userEmail) {
        Account account = accountRepository.findByAccountNumber(request.getAccountNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        if (!account.getUser().getEmail().equals(userEmail)) {
            throw new BankingException("Unauthorized access to this account", HttpStatus.FORBIDDEN);
        }
        if (account.getStatus() != Account.AccountStatus.ACTIVE) {
            throw new BankingException("Account is inactive", HttpStatus.BAD_REQUEST);
        }

        account.setBalance(account.getBalance().add(request.getAmount()));
        accountRepository.save(account);

        Transaction transaction = Transaction.builder()
                .transactionReference(UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase())
                .transactionType(Transaction.TransactionType.CREDIT)
                .amount(request.getAmount())
                .receiverAccount(account)
                .description(request.getDescription() != null ? request.getDescription() : "Deposit")
                .status(Transaction.TransactionStatus.COMPLETED)
                .build();

        transaction = transactionRepository.save(transaction);
        return mapToResponse(transaction);
    }

    @Transactional
    public TransactionResponse withdraw(WithdrawRequest request, String userEmail) {
        Account account = accountRepository.findByAccountNumber(request.getAccountNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        if (!account.getUser().getEmail().equals(userEmail)) {
            throw new BankingException("Unauthorized access to this account", HttpStatus.FORBIDDEN);
        }
        if (account.getStatus() != Account.AccountStatus.ACTIVE) {
            throw new BankingException("Account is inactive", HttpStatus.BAD_REQUEST);
        }
        if (account.getBalance().compareTo(request.getAmount()) < 0) {
            throw new InsufficientBalanceException("Insufficient balance. Available: " + account.getBalance());
        }

        account.setBalance(account.getBalance().subtract(request.getAmount()));
        accountRepository.save(account);

        Transaction transaction = Transaction.builder()
                .transactionReference(UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase())
                .transactionType(Transaction.TransactionType.DEBIT)
                .amount(request.getAmount())
                .senderAccount(account)
                .description(request.getDescription() != null ? request.getDescription() : "Withdrawal")
                .status(Transaction.TransactionStatus.COMPLETED)
                .build();

        transaction = transactionRepository.save(transaction);
        return mapToResponse(transaction);
    }

    public Page<TransactionResponse> getTransactionHistory(
            String accountNumber,
            String userEmail,
            String type,
            String startDate,
            String endDate,
            int page,
            int size) {

        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        if (!account.getUser().getEmail().equals(userEmail)) {
            throw new BankingException("Unauthorized access", HttpStatus.FORBIDDEN);
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Transaction.TransactionType txType = null;
        if (type != null && !type.isBlank()) {
            txType = Transaction.TransactionType.valueOf(type.toUpperCase());
        }

        LocalDateTime start = startDate != null && !startDate.isBlank()
                ? LocalDate.parse(startDate).atStartOfDay() : null;
        LocalDateTime end = endDate != null && !endDate.isBlank()
                ? LocalDate.parse(endDate).atTime(23, 59, 59) : null;

        return transactionRepository
                .findByAccountWithFilters(account, txType, start, end, pageable)
                .map(this::mapToResponse);
    }

    public TransactionResponse mapToResponse(Transaction t) {
        return TransactionResponse.builder()
                .id(t.getId())
                .transactionReference(t.getTransactionReference())
                .transactionType(t.getTransactionType())
                .amount(t.getAmount())
                .senderAccountNumber(t.getSenderAccount() != null ? t.getSenderAccount().getAccountNumber() : null)
                .senderName(t.getSenderAccount() != null ? t.getSenderAccount().getUser().getFullName() : null)
                .receiverAccountNumber(t.getReceiverAccount() != null ? t.getReceiverAccount().getAccountNumber() : null)
                .receiverName(t.getReceiverAccount() != null ? t.getReceiverAccount().getUser().getFullName() : null)
                .description(t.getDescription())
                .status(t.getStatus())
                .createdAt(t.getCreatedAt())
                .build();
    }
}
