package com.colasmadagascar.stockinventory.mouvement;

import com.colasmadagascar.stockinventory.mouvement.stock.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Time;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface MouvementRepository extends JpaRepository<Mouvement,Long> {
    @Query(nativeQuery = true, value = "INSERT INTO commande_ligne (cmde_ligne_qte, cmde_ligne_pu, art_num_serie, mvt_type, cmde_id, empl_id, art_id, periode_id,cmde_bc) " +
            "VALUES (:#{#mouvement.cmdeLigneQte}, :#{#mouvement.cmdeLignePu}, :#{#mouvement.artNumSerie}, :#{#mouvement.mvtType}, :#{#mouvement.cmdeId}, :#{#mouvement.emplId}, :#{#mouvement.artId}, :#{#mouvement.periodeId}, :#{#mouvement.cmdeBc})")
    @Modifying
    void saveMvt(@Param("mouvement") Mouvement mouvement);


    @Query(nativeQuery = true,value = "select * from v_mouvement_lib where mvttype > 0")
    @Modifying
    List<MouvementDTO> getAllSortie();

    @Query(nativeQuery = true,value = "select * from v_mouvement_lib where mvttype = 0")
    @Modifying
    List<MouvementDTO> getAllEntree();

    @Query(nativeQuery = true,value = "select * from v_stock_par_emplacement_final")
    List<Stock> getEtatStock();

    @Query(nativeQuery = true, value = "select * from v_stock_par_emplacement_final where empl_id=?1 and art_id=?2 and periode_id=?3 order by quantite limit 1")
    Stock findExistanceStock(Long emplId, Long unopId, Long periodeId);



    @Query(nativeQuery = true,value = "select fun_get_valorisation(?1,?2,?3)")
    Double getValorisation(Long magId, Long emplId, String code);

}
