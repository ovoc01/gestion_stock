package com.colasmadagascar.stockinventory.magasin;

import org.springframework.data.domain.ManagedTypes;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface MagasinRepository extends JpaRepository<Magasin,Long> {

    Page<Magasin> findAll(Pageable pageable);

    long count();

    ;
}