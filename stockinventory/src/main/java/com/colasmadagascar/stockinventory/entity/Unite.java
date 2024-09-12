package com.colasmadagascar.stockinventory.entity;

import java.util.List;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.Table;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.FetchType;
import jakarta.persistence.CascadeType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import java.sql.Timestamp;

@Entity
@Table(name="unite")

public class Unite  {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    
    Long uniteId;

    @Column
    String uniteLi;
    @Column
    String uniteAbrv;
    @Column
    Timestamp uniteDtCr;
    @Column
    Timestamp uniteDernMdf;

    

    
    public void setUniteId(Long uniteId){
        this.uniteId = uniteId;
    }

    public Long getUniteId(){
        return this.uniteId;
    }


    public void setUniteLi(String uniteLi){
        this.uniteLi = uniteLi;
    }

    public String getUniteLi(){
        return this.uniteLi;
    }


    public void setUniteAbrv(String uniteAbrv){
        this.uniteAbrv = uniteAbrv;
    }

    public String getUniteAbrv(){
        return this.uniteAbrv;
    }


    public void setUniteDtCr(Timestamp uniteDtCr){
        this.uniteDtCr = uniteDtCr;
    }

    public Timestamp getUniteDtCr(){
        return this.uniteDtCr;
    }


    public void setUniteDernMdf(Timestamp uniteDernMdf){
        this.uniteDernMdf = uniteDernMdf;
    }

    public Timestamp getUniteDernMdf(){
        return this.uniteDernMdf;
    }



}