package com.colasmadagascar.stockinventory.livraison.request;

import com.colasmadagascar.stockinventory.livraison.validator.ValidateLivraison;
import java.sql.Time;
import java.time.LocalDate;
import lombok.Data;

@Data
@ValidateLivraison
public class LivraisonCreationRequest {
   private Long fournisseur;
   private Long emplacement;
   private String livreur;
   private String cin;
   private String bonLivraison;
   private LocalDate dateLivraison;
   private Time heureLivraison;
   private LocalDate dateEcheance;
   private String bonCommande;
   private LocalDate dateCommande;
   private String observation;
}
