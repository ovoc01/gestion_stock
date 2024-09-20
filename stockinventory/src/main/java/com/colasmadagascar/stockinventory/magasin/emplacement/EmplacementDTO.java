package com.colasmadagascar.stockinventory.magasin.emplacement;

import java.time.LocalDateTime;

public interface EmplacementDTO {
      Long getEmplId();
      String getEmplLi();
      String getServiceLi();
      Long getMagId();
      Long getServiceId();
      String getMagLi();
      LocalDateTime getEmplDtCr();
      String getEmplDernMdf();
}
