package com.colasmadagascar.stockinventory.article.famille;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FamilleRequest {

    @NotNull(message = "Libellé du famille ne doit pas être null")
    @NotBlank(message ="Libellé du famille ne doit pas être vide" )
    private String familleLi;
}
