package com.colasmadagascar.stockinventory.magasin.emplacement;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository

public interface EmplacementRepository extends JpaRepository<Emplacement,Long> {
   
   @Query(nativeQuery = true, value = "INSERT INTO emplacement (empl_li, service_id, mag_id) VALUES (?1, ?2, ?3)")
   @Modifying
   void createEmplacement(String emplLi, Long serviceId, Long magId);

   Optional<Emplacement> getEmplacementByEmplLi(String li);

   @Query(nativeQuery = true, value = "SELECT * FROM v_emplacement_lib")
   Page<EmplacementDTO> findAllEmplacementDTO(Pageable pageable);

   @Query(nativeQuery = true, value = "UPDATE emplacement SET empl_li = ?2, service_id = ?3, mag_id = ?4 WHERE empl_id = ?1")
   @Modifying
   void updateEmplacement(Long emplId, String emplLi, Long serviceId, Long magId);
}