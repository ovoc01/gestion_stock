package com.colasmadagascar.stockinventory.magasin;

import java.time.LocalDate;
import java.util.List;

import com.colasmadagascar.stockinventory.magasin.dto.UtilisateurMagasinDTO;
import com.colasmadagascar.stockinventory.mouvement.stock.StockParEmplacement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository

public interface MagasinRepository extends JpaRepository<Magasin, Long> {

    Page<Magasin> findAll(Pageable pageable);

    long count();

    @Query(nativeQuery = true, value = "insert into utilisateur_magasin(mag_id, usr_id,depuis) values (?1, ?2,?3)")
    @Modifying
    void addUtilisateurToMagasin(Long magId, Long usrId, LocalDate debut);

    @Query(nativeQuery = true, value = "insert into utilisateur_magasin(mag_id, usr_id) values (?1, ?2)")
    @Modifying
    void addUtilisateurToMagasin(Long magId, Long usrId);

    @Query(nativeQuery = true, value = "select * from v_utilisateur_magasin_lib where usrId = ?1")
    List<UtilisateurMagasinDTO> getUtilisateurMagasin(Long usrId);

    @Query(nativeQuery = true, value = "select  * from v_magasin_detail_ligne_lib where mag_id =?1")
    MagasinInfo getMagasinDetailsInfo(Long magId);

    @Query(nativeQuery = true, value = "select * from v_stock_par_emplacement_final_lib where magid=?1")
    List<StockParEmplacement> getStockParEmplacement(Long magId);

    @Query(nativeQuery = true, value = "select fun_get_valorisation(?1,null,null)")
    Double getValorisationMagasin(Long magid);
}
