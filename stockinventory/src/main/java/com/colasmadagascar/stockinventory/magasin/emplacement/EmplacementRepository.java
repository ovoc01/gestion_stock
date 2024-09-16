package com.colasmadagascar.stockinventory.magasin.emplacement;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface EmplacementRepository extends JpaRepository<Emplacement,Long> {

}