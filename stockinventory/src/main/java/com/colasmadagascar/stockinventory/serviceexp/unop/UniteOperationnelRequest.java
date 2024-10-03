package com.colasmadagascar.stockinventory.serviceexp.unop;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.sql.Timestamp;

@Data
public class UniteOperationRequest {
    @Column
    @NotBlank(message = "Le nom du unité operationnel est requis")
    @NotNull(message = "Le nom du unité operationnel est requis")
    String unopLi;


    @NotNull(message = "Le numero bu du unité operationnel est requis")
    @NotBlank(message = "Le numero bu du unité operationnel est requis")
    String unopNumBu;


    @NotBlank(message = "Le nom bu du unité operationnel est requis")
    @NotNull(message = "Le nom bu du unité operationnel est requis")
    @Column
    String unopLiBu;
    @Column
    @NotBlank(message = "Le numero affaire du unité operationnel est requis")
    @NotNull(message = "Le numero affaire du unité operationnel est requis")
    String unopLiNumAff;
    @Column
    String unopRef;
    @Column
    @NotBlank(message = "Le Mdm Id du unité operationnel est requis")
    @NotNull(message = "Le Mdm Id du unité operationnel est requis")
    String unopMdmId;

    @NotBlank(message = "Le UE du unité operationnel est requis")
    @NotNull(message = "Le UE Id du unité operationnel est requis")
    @Column
    String unopUe;
    @Column
    @NotBlank(message = "Le libellé UE Id du unité operationnel est requis")
    @NotNull(message = "Le libellé UE du unité operationnel est requis")
    String unopUeLi;
    @Column
    Double unopLng;
    @Column
    Double unopLtd;
    @Column
    Timestamp unopDtCr;
    @Column
    Timestamp unopDernMdf;

}
