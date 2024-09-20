package com.colasmadagascar.stockinventory.article.famille;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface FamilleRepository extends JpaRepository<Famille,Long> {

}