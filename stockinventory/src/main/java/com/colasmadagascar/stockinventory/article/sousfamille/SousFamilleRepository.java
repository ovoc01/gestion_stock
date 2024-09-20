package com.colasmadagascar.stockinventory.article.sousfamille;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository

public interface SousFamilleRepository extends JpaRepository<SousFamille,Long> {

    @Query(nativeQuery = true, value = "INSERT INTO  sous_famille (sous_fam_li,famille_id)  VALUES (?1,?2)")
    @Modifying
    void createSousFamille(String sousFamLi, Long familleId);

    @Query(nativeQuery = true,value = "update sous_famille set sous_fam_li=?1,famille_id=?2 ,sous_fam_dern_mdf=current_timestamp where sous_fam_id=?3")
    @Modifying
    void updateSousFamille(String sousFamLi, Long familleId, Long sousFamId);

    @Query(nativeQuery = true,value = "select * from v_sous_famille_lib")
    Page<SousFamilleDTO> findAllSousFamilles(Pageable pageable);
}