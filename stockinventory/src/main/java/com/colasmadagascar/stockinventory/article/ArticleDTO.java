package com.colasmadagascar.stockinventory.article;


import com.colasmadagascar.stockinventory.dataexport.tools.ExcelRow;

import java.time.LocalDateTime;


public interface ArticleDTO {
    @ExcelRow(1)
    public Long getArtId();

    @ExcelRow(2)
    public String getArtLi();

    @ExcelRow(3)
    public String getArtRef();

    @ExcelRow(4)
    public String getArtCd();

    public Long getServiceId();

    @ExcelRow(5)
    public String getServiceLi();

    public Long getSousFamId();

    @ExcelRow(6)
    public String getSousFamLi();

    public Long getUniteId();

    @ExcelRow(7)
    public String getUniteLi();

    public Double getArtPu();

    public Double getArtCmp();

    public Double getArtQte();

    public LocalDateTime getArtDte();
}
