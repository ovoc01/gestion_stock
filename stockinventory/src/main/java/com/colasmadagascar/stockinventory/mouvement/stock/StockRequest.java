package com.colasmadagascar.stockinventory.mouvement.stock;

import lombok.Data;

@Data
public class StockRequest {
    private Long emplId;
    private Long magId;
    private String code;
}
