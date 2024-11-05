package com.colasmadagascar.stockinventory.magasin.request;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UtilisateurMagasinRequest {
   @NotNull(message = "Sélectionnez un magasin")
   private Long magId;
   @NotNull(message = "Aucun utilisateur sélectionnez")
   private Long usrId;

   @NotNull(message = "Date de début requis")
   private LocalDate debut;
   private LocalDate fin;
}
