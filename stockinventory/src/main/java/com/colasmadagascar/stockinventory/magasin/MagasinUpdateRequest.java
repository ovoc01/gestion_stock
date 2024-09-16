package com.colasmadagascar.stockinventory.magasin;


import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MagasinUpdateRequest {
    private Long magId;
    private String magLi;
    private LocalDateTime magDtCr;
}
