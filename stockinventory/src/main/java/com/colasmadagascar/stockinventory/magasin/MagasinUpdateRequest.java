package com.colasmadagascar.stockinventory.magasin;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MagasinUpdateRequest {

    @NotNull(message = "L'identifiant du magasin est requis")
    private Long magId;
    @NotBlank(message = "Le libellé du magasin est requis")
    @NotNull(message = "Le libellé du magasin est requis")
    private String magLi;
    private LocalDateTime magDtCr;
}
