package com.colasmadagascar.stockinventory.serviceexp.request;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UtilisateurServiceRequest {
   @NotNull(message = "Aucun service selectionné")
   private Long serviceId;
   @NotNull(message = "Aucun utilisateur selectionné")
   private Long usrId;

   @NotNull(message = "Date début nécessaire")
   private LocalDate depuis;
   private LocalDate fin;
}
