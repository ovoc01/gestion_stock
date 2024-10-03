package com.colasmadagascar.stockinventory.serviceexp.unop;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.sql.Timestamp;

@Data
public class UniteOperationnelUpdateRequest {

    Long unopId;

    @NotBlank(message = "Le nom du unité operationnel est requis")
    @NotNull(message = "Le nom du unité operationnel est requis")
    String unopLi;


    @NotNull(message = "Le numero bu du unité operationnel est requis")
    @NotBlank(message = "Le numero bu du unité operationnel est requis")
    String unopNumBu;



    @NotBlank(message = "Le numero affaire du unité operationnel est requis")
    @NotNull(message = "Le numero affaire du unité operationnel est requis")
    String unopLiNumAff;
    
    String unopRef;
    
    @NotBlank(message = "Le Mdm Id du unité operationnel est requis")
    @NotNull(message = "Le Mdm Id du unité operationnel est requis")
    String unopMdmId;

    @NotBlank(message = "Le UE du unité operationnel est requis")
    @NotNull(message = "Le UE Id du unité operationnel est requis")
    
    String unopUe;
    
    @NotBlank(message = "Le libellé UE Id du unité operationnel est requis")
    @NotNull(message = "Le libellé UE du unité operationnel est requis")
    String unopUeLi;
    
    Double unopLng;
    
    Double unopLtd;
    
    Timestamp unopDtCr;
    
    Timestamp unopDernMdf;

}
