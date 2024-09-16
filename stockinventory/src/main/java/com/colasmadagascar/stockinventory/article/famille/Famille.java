package com.colasmadagascar.stockinventory.article.famille;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.Table;

import java.sql.Timestamp;

@Entity
@Table(name="famille")

public class Famille  {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    
    Long familleId;

    @Column
    String familleLi;
    @Column
    Integer familleNumCom;
    @Column
    Timestamp familleDtCr;
    @Column
    Timestamp familleDernMdf;
    @Column
    String famLogRef;

    

    
    public void setFamilleId(Long familleId){
        this.familleId = familleId;
    }

    public Long getFamilleId(){
        return this.familleId;
    }


    public void setFamilleLi(String familleLi){
        this.familleLi = familleLi;
    }

    public String getFamilleLi(){
        return this.familleLi;
    }


    public void setFamilleNumCom(Integer familleNumCom){
        this.familleNumCom = familleNumCom;
    }

    public Integer getFamilleNumCom(){
        return this.familleNumCom;
    }


    public void setFamilleDtCr(Timestamp familleDtCr){
        this.familleDtCr = familleDtCr;
    }

    public Timestamp getFamilleDtCr(){
        return this.familleDtCr;
    }


    public void setFamilleDernMdf(Timestamp familleDernMdf){
        this.familleDernMdf = familleDernMdf;
    }

    public Timestamp getFamilleDernMdf(){
        return this.familleDernMdf;
    }


    public void setFamLogRef(String famLogRef){
        this.famLogRef = famLogRef;
    }

    public String getFamLogRef(){
        return this.famLogRef;
    }



}