package com.colasmadagascar.stockinventory.serviceexp.unop;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.sql.Timestamp;

@Entity
@Table(name = "unite_operationnel")
@Data
public class UniteOperationnel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    Long unopId;

    @Column
    @NotBlank(message = "Le nom du unité operationnel est requis")
    @NotNull(message = "Le nom du unité operationnel est requis")
    String unopLi;


    @NotNull(message = "Le numero bu du unité operationnel est requis")
    @Column
    Integer unopNumBu;


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
    String unopMatrnId;
    @Column
    Double unopLng;
    @Column
    Double unopLtd;
    @Column
    Timestamp unopDtCr;
    @Column
    Timestamp unopDernMdf;

}