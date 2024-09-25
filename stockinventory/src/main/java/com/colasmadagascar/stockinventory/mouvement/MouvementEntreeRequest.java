package com.colasmadagascar.stockinventory.mouvement;


import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MouvementEntreeRequest {
    @Min(value = 0,message = "La quantite doit être superieur à 0")
            @NotNull(message = "La quantite ne doit pas être null")
    Long quantite;

    @Min(value = 0,message = "Le pu doit être superieur à 0")
    @NotNull(message = "Le pu ne doit pas être null")
    Long prixUnitaire;

    @NotNull(message = "Choisissez un article")
    Long article;

    @NotNull(message = "Choisissez un emplacement")
    Long emplacement;

    @NotBlank(message = "Le bon de commande est requis")
    @NotNull(message = "La justification ne doit pas être null")
    String justif;

}
