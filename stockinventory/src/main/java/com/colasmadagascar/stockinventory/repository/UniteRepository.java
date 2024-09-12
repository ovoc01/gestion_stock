package com.colasmadagascar.stockinventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.colasmadagascar.stockinventory.entity.Unite;

@Repository

public interface UniteRepository extends JpaRepository<Unite,Long> {

}