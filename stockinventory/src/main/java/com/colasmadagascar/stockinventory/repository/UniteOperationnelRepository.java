package com.colasmadagascar.stockinventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.colasmadagascar.stockinventory.entity.UniteOperationnel;

@Repository

public interface UniteOperationnelRepository extends JpaRepository<UniteOperationnel,Long> {

}