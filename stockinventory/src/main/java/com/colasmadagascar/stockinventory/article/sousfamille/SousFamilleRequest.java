package com.colasmadagascar.stockinventory.article.sousfamille;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SousFamilleRequest {
    private Long sousFamId;

    @NotBlank(message = "Le libellé du sous famille est requis")
    @NotNull(message = "Le libellé ddu sous famille est requis")
    private String sousFamLi;

    @NotNull(message = "L'identifiant du famille est requis")
    private Long familleId;

}
