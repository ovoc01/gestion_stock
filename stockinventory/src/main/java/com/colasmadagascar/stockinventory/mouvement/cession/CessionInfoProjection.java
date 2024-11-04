package com.colasmadagascar.stockinventory.mouvement.cession;

import java.util.Date;
import java.time.LocalDate;

import com.colasmadagascar.stockinventory.utils.Utils;

public interface CessionInfoProjection {
    Long getCmdeId();

    String getService();

    String getNumeroAffaire();

    String getUniteOperationnel();

    String getUoBu();

    LocalDate getDateDebut();

    LocalDate getDateFin();

    Double getMontantTotal();

    default String getDateFinFinal() {
        if (getDateFin() == null)
            return "À déterminer";
        return getDateFin().toString();
    }

    default String getDateDebutFormatted() {
        return Utils.formatDate(getDateDebut());
    }

    default String getLabel() {
        return Utils.generateCessionLabel(getService());
    }

    default String getMontantTotalFormatted() {
        return Utils.formatCurrency(getMontantTotal());
    }

}