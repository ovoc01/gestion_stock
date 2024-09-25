package com.colasmadagascar.stockinventory.mouvement;

import com.colasmadagascar.stockinventory.mouvement.validator.MouvementSortieAnnotation;
import lombok.Data;

@Data
@MouvementSortieAnnotation
public class MouvementSortieRequest {
    Long quantite;
    Long article;
    Long commande;
    Long prixUnitaire;
}
