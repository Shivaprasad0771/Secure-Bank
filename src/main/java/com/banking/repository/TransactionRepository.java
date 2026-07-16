package com.banking.repository;

import com.banking.entity.Account;
import com.banking.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    @Query("SELECT t FROM Transaction t WHERE t.senderAccount = :account OR t.receiverAccount = :account ORDER BY t.createdAt DESC")
    Page<Transaction> findByAccount(@Param("account") Account account, Pageable pageable);

    @Query("SELECT t FROM Transaction t WHERE (t.senderAccount = :account OR t.receiverAccount = :account) " +
           "AND (:type IS NULL OR t.transactionType = :type) " +
           "AND (:startDate IS NULL OR t.createdAt >= :startDate) " +
           "AND (:endDate IS NULL OR t.createdAt <= :endDate) " +
           "ORDER BY t.createdAt DESC")
    Page<Transaction> findByAccountWithFilters(
            @Param("account") Account account,
            @Param("type") Transaction.TransactionType type,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.receiverAccount = :account AND t.transactionType = 'CREDIT'")
    BigDecimal sumCreditsByAccount(@Param("account") Account account);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.senderAccount = :account AND t.transactionType = 'DEBIT'")
    BigDecimal sumDebitsByAccount(@Param("account") Account account);

    List<Transaction> findTop5BySenderAccountOrReceiverAccountOrderByCreatedAtDesc(Account sender, Account receiver);

    long count();
}
