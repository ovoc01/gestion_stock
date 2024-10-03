package com.colasmadagascar.stockinventory.serviceexp.unop;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.sql.Timestamp;

@Entity
@Table(name = "unite_operationnel")
@Data
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
public class UniteOperationnel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    Long unopId;

    @Column

    String unopLi;


    @Column
    String unopNumBu;


    @Column
    String unopLiNumAff;

    @Column
    String unopRef;

    @Column
    String unopMdmId;

    @Column
    String unopUe;

    @Column
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