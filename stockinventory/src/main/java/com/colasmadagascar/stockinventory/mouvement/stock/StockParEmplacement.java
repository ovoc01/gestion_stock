package com.colasmadagascar.stockinventory.mouvement.stock;

public interface StockParEmplacement {
    String getMagasin();
    String getEmplacement();
    String getArticle();
    String getCode_article();
    Double getQuantite();
    Double getCmup();
    Double getUnite();
    default Double getPrixTotal(){
        return getCmup()*getQuantite();
    }

}
