package com.colasmadagascar.stockinventory.magasin.emplacement;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name="emplacement")
@Getter
@Setter
public class Emplacement  {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    
    Long emplId;

    @Column
    String emplLi;
    @Column
    Double emplLng;
    @Column
    Double emplLtd;
    @Column
    LocalDateTime emplDtCr;
    @Column
    LocalDateTime emplDernMdf;


}