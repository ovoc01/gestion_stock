/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.colasmadagascar.stockinventory.livraison;

import com.colasmadagascar.stockinventory.livraison.request.LivraisonCreationRequest;
import com.colasmadagascar.stockinventory.utilisateur.Utilisateur;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 *
 * @author dev
 */

@Service
@RequiredArgsConstructor
public class LivraisonService {
    private final LivraisonRepository livraisonRepository;
    
    public void create(LivraisonCreationRequest request,Utilisateur utilisateur){
        
        Livraison livraison = Livraison.builder()
                .emplId(request.getEmplacement())
                .fournisseur(request.getFournisseur())
                .livraisonBon(request.getBonLivraison())
                .livraisonBonCmde(request.getBonCommande())
                .livraisonCmdeDt(request.getDateCommande())
                .livraisonDtEcheance(request.getDateEcheance())
                .livraisonDt(request.getDateLivraison())
                .livraisonHr(request.getHeureLivraison())
                .livraisonDtSaisie(LocalDateTime.now())
                .livreur(request.getLivreur())
                .livreurCin(request.getCin())
                .saisisseurId(utilisateur.getUsrId())
                .periodeId(Long.parseLong("3"))
                .etat(0)
                .build();
        
        livraisonRepository.save(livraison);
    }
}
