package com.colasmadagascar.stockinventory.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.colasmadagascar.stockinventory.entity.Magasin;

@Repository

public interface MagasinRepository extends JpaRepository<Magasin,Long> {

    Page<Magasin> findAll(Pageable pageable);

    long count();
}