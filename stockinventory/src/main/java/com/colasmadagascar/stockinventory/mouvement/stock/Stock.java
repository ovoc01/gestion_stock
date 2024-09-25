package com.colasmadagascar.stockinventory.mouvement.stock;



public interface Stock {
    Long getEmplId();
    Long getArtId();
    Long getQuantite();
    Long getPrixUnitaire();
    Long getPeriodeId();
}
