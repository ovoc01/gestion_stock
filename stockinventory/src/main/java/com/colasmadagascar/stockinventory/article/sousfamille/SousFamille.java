package com.colasmadagascar.stockinventory.article.sousfamille;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.Table;

import java.sql.Timestamp;

@Entity
@Table(name="sous_famille")

public class SousFamille  {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    
    Long sousFamId;

    @Column
    String sousFamLi;
    @Column
    Timestamp sousFamDtCr;
    @Column
    Timestamp sousFamDernMdf;

    

    
    public void setSousFamId(Long sousFamId){
        this.sousFamId = sousFamId;
    }

    public Long getSousFamId(){
        return this.sousFamId;
    }


    public void setSousFamLi(String sousFamLi){
        this.sousFamLi = sousFamLi;
    }

    public String getSousFamLi(){
        return this.sousFamLi;
    }


    public void setSousFamDtCr(Timestamp sousFamDtCr){
        this.sousFamDtCr = sousFamDtCr;
    }

    public Timestamp getSousFamDtCr(){
        return this.sousFamDtCr;
    }


    public void setSousFamDernMdf(Timestamp sousFamDernMdf){
        this.sousFamDernMdf = sousFamDernMdf;
    }

    public Timestamp getSousFamDernMdf(){
        return this.sousFamDernMdf;
    }





}