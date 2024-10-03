package com.colasmadagascar.stockinventory.mouvement.sortie;

public interface CommandeDTO {
    public Long getCmdeId();

    public Long getEmplId();

    public Long getUnopId();
    public String getEmplacement();
    public String getUniteOperationnel();
    public String getLib_commande();

}
