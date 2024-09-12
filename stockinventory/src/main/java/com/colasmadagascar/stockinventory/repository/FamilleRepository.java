package com.colasmadagascar.stockinventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.colasmadagascar.stockinventory.entity.Famille;

@Repository

public interface FamilleRepository extends JpaRepository<Famille,Long> {

}