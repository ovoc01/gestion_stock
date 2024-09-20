package com.colasmadagascar.stockinventory.article.unite;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface UniteRepository extends JpaRepository<Unite,Long> {

}