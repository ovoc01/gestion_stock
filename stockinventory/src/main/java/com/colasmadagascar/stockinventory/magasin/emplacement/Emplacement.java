package com.colasmadagascar.stockinventory.magasin.emplacement;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.Table;

import java.sql.Timestamp;

@Entity
@Table(name="emplacement")

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
    Timestamp emplDtCr;
    @Column
    Timestamp emplDernMdf;

    

    
    public void setEmplId(Long emplId){
        this.emplId = emplId;
    }

    public Long getEmplId(){
        return this.emplId;
    }


    public void setEmplLi(String emplLi){
        this.emplLi = emplLi;
    }

    public String getEmplLi(){
        return this.emplLi;
    }


    public void setEmplLng(Double emplLng){
        this.emplLng = emplLng;
    }

    public Double getEmplLng(){
        return this.emplLng;
    }


    public void setEmplLtd(Double emplLtd){
        this.emplLtd = emplLtd;
    }

    public Double getEmplLtd(){
        return this.emplLtd;
    }


    public void setEmplDtCr(Timestamp emplDtCr){
        this.emplDtCr = emplDtCr;
    }

    public Timestamp getEmplDtCr(){
        return this.emplDtCr;
    }


    public void setEmplDernMdf(Timestamp emplDernMdf){
        this.emplDernMdf = emplDernMdf;
    }

    public Timestamp getEmplDernMdf(){
        return this.emplDernMdf;
    }





}