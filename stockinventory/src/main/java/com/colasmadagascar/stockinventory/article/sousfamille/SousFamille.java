package com.colasmadagascar.stockinventory.article.sousfamille;

import jakarta.persistence.*;
import lombok.Getter;

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

    @Getter
    @Column(name = "sous_fam_log_ref")
    String reference;

    

    
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