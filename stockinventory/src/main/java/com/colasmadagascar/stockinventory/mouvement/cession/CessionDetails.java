package com.colasmadagascar.stockinventory.mouvement.cession;

import java.time.LocalDate;
import com.colasmadagascar.stockinventory.utils.Utils;

public interface CessionDetails {
   LocalDate getDateAjout();

   String getNumeroPiece();

   String getDesignation();

   Double getQuantite();

   Double getPrixUnitaire();

   Double getMontant();

   default String getFormattedPrixUnitaire() {
      return Utils.formatCurrency(getPrixUnitaire());
   }

   default String getFormattedMontant() {
      return Utils.formatCurrency(getMontant());
   }

   default String getFormattedQuantite() {
      return String.format("%.2f", getQuantite());
   }

}
