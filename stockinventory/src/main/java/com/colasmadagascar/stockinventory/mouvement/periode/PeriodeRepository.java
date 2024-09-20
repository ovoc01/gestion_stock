package com.colasmadagascar.stockinventory.mouvement.periode;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface PeriodeRepository extends JpaRepository<Periode,Long> {

}