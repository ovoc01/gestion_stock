package com.colasmadagascar.stockinventory.magasin.dto;

import com.colasmadagascar.stockinventory.magasin.MagasinInfo;
import com.colasmadagascar.stockinventory.mouvement.stock.StockParEmplacement;
import lombok.Data;

import java.util.List;

@Data
public class MagasinDetailsDTO {
    MagasinInfo info;
    List<StockParEmplacement> stocks;
    Double valorisations;
}
