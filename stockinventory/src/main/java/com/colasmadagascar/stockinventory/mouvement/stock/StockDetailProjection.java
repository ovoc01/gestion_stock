package com.colasmadagascar.stockinventory.mouvement.stock;

import com.colasmadagascar.stockinventory.dataexport.tools.ExcelRow;

public interface StockDetailProjection {
    @ExcelRow(1)
    String getCode_article();
    @ExcelRow(2)
    String getArticle();
    @ExcelRow(3)
    String getSous_famille();
    Long getMagId();
    @ExcelRow(4)
    String getMagasin();
    @ExcelRow(5)
    String getEmplacement();
    @ExcelRow(6)
    Double getQuantite();
    @ExcelRow(7)
    Double getCmup();

}
