package com.colasmadagascar.stockinventory.magasin;

import com.colasmadagascar.stockinventory.utils.Utils;


import java.time.LocalDateTime;

public interface MagasinInfo {
    String getMagasin();
    LocalDateTime getDateCreation();
    String getTelephone();
    String getUtilisateurs();
    Integer getNombreEmplacement();
    default String getNiceDate(){
        return Utils.formatTimestamp(getDateCreation());
    }
}
