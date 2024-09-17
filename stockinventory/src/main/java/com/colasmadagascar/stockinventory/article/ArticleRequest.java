package com.colasmadagascar.stockinventory.article;


import lombok.Data;

@Data
public class ArticleRequest {
    public Long artId;
    public Long serviceId;
    public Long sousFamId;
    public Long uniteId;
    public String artLi;
    public String artRef;
}
