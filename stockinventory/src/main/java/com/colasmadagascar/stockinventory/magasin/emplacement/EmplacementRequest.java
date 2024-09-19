package com.colasmadagascar.stockinventory.magasin.emplacement;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EmplacementRequest {
   Long emplId;
   @NotBlank(message = "Le libellé de l'emplacement est requis")
   @NotNull(message = "Le libellé de l'emplacement est requis")
   String emplLi;

   @NotNull(message = "L'identifiant de service est requis")
   Long serviceId;

   @NotNull(message = "L'identifiant de magasin est requis")
   Long magId;
}
