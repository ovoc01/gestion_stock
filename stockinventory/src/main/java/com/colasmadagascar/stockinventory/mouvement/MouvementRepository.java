package com.colasmadagascar.stockinventory.mouvement;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Time;
import java.util.Date;
import java.util.List;

@Repository
public interface MouvementRepository extends JpaRepository<Mouvement,Long> {
    @Query(nativeQuery = true, value = "INSERT INTO commande_ligne (cmde_ligne_qte, cmde_ligne_pu, art_num_serie, mvt_type, cmde_id, empl_id, art_id, periode_id) " +
            "VALUES (:#{#mouvement.cmdeLigneQte}, :#{#mouvement.cmdeLignePu}, :#{#mouvement.artNumSerie}, :#{#mouvement.mvtType}, :#{#mouvement.cmdeId}, :#{#mouvement.emplId}, :#{#mouvement.artId}, :#{#mouvement.periodeId})")
    @Modifying
    void saveMvt(@Param("mouvement") Mouvement mouvement);


    @Query(nativeQuery = true,value = "select * from v_mouvement_lib where mvttype = 0")
    @Modifying
    List<MouvementDTO> getAllSortie();

}
