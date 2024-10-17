package com.colasmadagascar.stockinventory.livraison.request;

import java.time.LocalDate;

import com.colasmadagascar.stockinventory.livraison.validator.ValidateLivraison;
import lombok.Data;

@Data
@ValidateLivraison
public class LivraisonCreationRequest {
   private Long fournisseur;
   private String livreur;
   private String cin;
   private String bonLivraison;
   private LocalDate dateLivraison;
   private LocalDate dateEcheance;
   private String bonCommande;
   private LocalDate dateCommande;
   private String observation;
}
