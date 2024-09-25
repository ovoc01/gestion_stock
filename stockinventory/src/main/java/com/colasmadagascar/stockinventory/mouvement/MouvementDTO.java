package com.colasmadagascar.stockinventory.mouvement;

import java.util.Date;

public interface MouvementDTO {
    public Long getCmdeLigneId();
    public String getArticle();
    public String getCode();
    public String getReference();
    public String getEmplacement();
    public Double getPrixUnitaire();
    public Double getQuantite();
    public String getUnite();
    public Date getDateDeMouvement();
    public Integer getMvtType();
}
