package com.colasmadagascar.stockinventory.utilisateur;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    Optional<Utilisateur> findByUsrLogin(String login);

    @Query(nativeQuery = true, value = "SELECT * FROM v_utilisateur_lib_complet")
    List<UtilisateurDTO> findAllBy();

    @Query(nativeQuery = true, value = "SELECT * FROM v_utilisateur_lib_complet WHERE usr_id = ?1")
    UtilisateurDTO findByUsrId(Long id);
}