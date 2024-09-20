package com.colasmadagascar.stockinventory.article;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ArticleRequest {

    public Long artId;
    @NotNull(message = "Une service est requis")
    public Long serviceId;
    @NotNull(message = "Une sous famille est requis")
    public Long sousFamId;

    @NotNull(message = "Un unité de mesure est requis")
    public Long uniteId;
    @NotNull(message = "Le libellé de l'article est requis")
    @NotBlank(message = "Le libellé de l'article est requis")
    public String artLi;
    public String artRef;
}
