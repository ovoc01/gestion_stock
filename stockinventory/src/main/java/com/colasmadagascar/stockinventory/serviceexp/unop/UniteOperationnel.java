package com.colasmadagascar.stockinventory.serviceexp.unop;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.Table;

import java.sql.Timestamp;

@Entity
@Table(name="unite_operationnel")

public class UniteOperationnel  {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    
    Long unopId;

    @Column
    String unopLi;
    @Column
    Integer unopNumBu;
    @Column
    String unopLiBu;
    @Column
    String unopLiNumAff;
    @Column
    String unopRef;
    @Column
    String unopMatrnId;
    @Column
    Double unopLng;
    @Column
    Double unopLtd;
    @Column
    Timestamp unopDtCr;
    @Column
    Timestamp unopDernMdf;

    

    
    public void setUnopId(Long unopId){
        this.unopId = unopId;
    }

    public Long getUnopId(){
        return this.unopId;
    }


    public void setUnopLi(String unopLi){
        this.unopLi = unopLi;
    }

    public String getUnopLi(){
        return this.unopLi;
    }


    public void setUnopNumBu(Integer unopNumBu){
        this.unopNumBu = unopNumBu;
    }

    public Integer getUnopNumBu(){
        return this.unopNumBu;
    }


    public void setUnopLiBu(String unopLiBu){
        this.unopLiBu = unopLiBu;
    }

    public String getUnopLiBu(){
        return this.unopLiBu;
    }


    public void setUnopLiNumAff(String unopLiNumAff){
        this.unopLiNumAff = unopLiNumAff;
    }

    public String getUnopLiNumAff(){
        return this.unopLiNumAff;
    }


    public void setUnopRef(String unopRef){
        this.unopRef = unopRef;
    }

    public String getUnopRef(){
        return this.unopRef;
    }


    public void setUnopMatrnId(String unopMatrnId){
        this.unopMatrnId = unopMatrnId;
    }

    public String getUnopMatrnId(){
        return this.unopMatrnId;
    }


    public void setUnopLng(Double unopLng){
        this.unopLng = unopLng;
    }

    public Double getUnopLng(){
        return this.unopLng;
    }


    public void setUnopLtd(Double unopLtd){
        this.unopLtd = unopLtd;
    }

    public Double getUnopLtd(){
        return this.unopLtd;
    }


    public void setUnopDtCr(Timestamp unopDtCr){
        this.unopDtCr = unopDtCr;
    }

    public Timestamp getUnopDtCr(){
        return this.unopDtCr;
    }


    public void setUnopDernMdf(Timestamp unopDernMdf){
        this.unopDernMdf = unopDernMdf;
    }

    public Timestamp getUnopDernMdf(){
        return this.unopDernMdf;
    }



}