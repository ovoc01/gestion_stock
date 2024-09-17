package com.colasmadagascar.stockinventory.article;

import java.time.LocalDateTime;

public interface ArticleDTO {
    public Long getArtId();
    public String getArtLi();
    public String getArtRef();
    public String getArtCd();
    public Long getServiceId();
    public String getServiceLi();
    public Long getSousFamId();
    public String getSousFamLi();
    public Long getUniteId();
    public String getUniteLi();
    public Double getArtPu();
    public Double getArtCmp();
    public Double getArtQte();
    public LocalDateTime getArtDte(); 
}
