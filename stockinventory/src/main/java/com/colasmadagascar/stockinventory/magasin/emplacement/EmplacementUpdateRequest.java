package com.colasmadagascar.stockinventory.magasin.emplacement;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EmplacementUpdateRequest {
    @NotNull(message = "L'identifiant de l'emplacement est requis")
    Long emplId;


    @NotNull(message = "Le libellé de l'emplacement est requis")
    @NotBlank(message = "Le libellé de l'emplacement est requis")
    String emplLi;

    @NotNull(message = "L'emplacement doit être rattaché à un service")
    Long serviceId;

    @NotNull(message = "L'emplacement doit être rattaché à un magasin")
    Long magId;
}
