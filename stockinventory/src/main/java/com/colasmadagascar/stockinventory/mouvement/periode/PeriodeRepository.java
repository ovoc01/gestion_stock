package com.colasmadagascar.stockinventory.mouvement.periode;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository

public interface PeriodeRepository extends JpaRepository<Periode,Long> {
    @Query(
            nativeQuery = true,
            value = "select * from periode where periode_etat = 0"
    )
    Periode getCurrentActivePeriode();
}