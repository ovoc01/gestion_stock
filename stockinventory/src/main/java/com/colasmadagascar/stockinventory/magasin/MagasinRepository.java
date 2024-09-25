package com.colasmadagascar.stockinventory.magasin;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository

public interface MagasinRepository extends JpaRepository<Magasin,Long> {

    Page<Magasin> findAll(Pageable pageable);

    long count();
    
    @Query(nativeQuery = true, value = "insert into utilisateur_magasin(mag_id, usr_id) values (?1, ?2)")
    @Modifying
    void addUtilisateurToMagasin (Long magId, Long usrId);

    @Query(nativeQuery = true, value = "select * from v_utilisateur_magasin where usrId = ?1")
    List<UtilisateurMagasinDTO> getUtilisateurMagasin(Long usrId);
}