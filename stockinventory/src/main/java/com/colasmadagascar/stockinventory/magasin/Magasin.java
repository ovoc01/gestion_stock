package com.colasmadagascar.stockinventory.magasin;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.Table;
import lombok.*;

import java.sql.Timestamp;

@Entity
@Table(name="magasin")
@ToString
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Magasin  {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    
    Long magId;

    @Column
    String magLi;
    @Column
    String magCom;

    @Getter
    @Column
    LocalDateTime magDtCr;
    @Column
    LocalDateTime magDernMdf;

    

    









}