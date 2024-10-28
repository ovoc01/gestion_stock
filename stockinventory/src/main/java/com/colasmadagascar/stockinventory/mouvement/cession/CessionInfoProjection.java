package com.colasmadagascar.stockinventory.mouvement.cession;


import java.util.Date;

public interface CessionInfoProjection {
    Long getCmdeId();

    String getService();

    String getNumeroAffaire();

    String getUniteOperationnel();

    String getUoBu();

    Date getDateDebut();

    Date getDateFin();

    default String getDateFinFinal() {
        if (getDateFin() == null) return "À déterminer";
        return getDateFin().toString();
    }
}