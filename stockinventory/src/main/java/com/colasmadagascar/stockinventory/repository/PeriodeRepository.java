package com.colasmadagascar.stockinventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.colasmadagascar.stockinventory.entity.Periode;

@Repository

public interface PeriodeRepository extends JpaRepository<Periode,Long> {

}