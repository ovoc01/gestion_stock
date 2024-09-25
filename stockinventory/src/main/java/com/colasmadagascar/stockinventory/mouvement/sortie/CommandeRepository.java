package com.colasmadagascar.stockinventory.mouvement.sortie;

import com.colasmadagascar.stockinventory.mouvement.stock.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommandeRepository extends JpaRepository<Commande,Long> {

    @Query(nativeQuery = true,value = "insert into commande(empl_id, unop_id,periode_id) values (?1, ?2,?3)")
    @Modifying
    void persist(Long emplId,Long unopId,Long periodeId);


    @Query(nativeQuery = true, value = "select * from commande where empl_id=?1 and unop_id=?2 and periode_id=?3 ")
    Optional<Commande> findExistance(Long emplId, Long unopId, Long periodeId);

    @Query(nativeQuery = true, value = "select * from v_stock_par_emplacement")
    List<Stock> getEtatStock();


}
