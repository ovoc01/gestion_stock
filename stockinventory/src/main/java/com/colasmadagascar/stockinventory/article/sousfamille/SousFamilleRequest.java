package com.colasmadagascar.stockinventory.article.sousfamille;


import lombok.Data;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Data
public class SousFamilleRequest {
    private Long sousFamId;
    private String sousFamLi;
    private Long familleId;

}
