package com.colasmadagascar.stockinventory.article;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.Table;

import java.sql.Timestamp;

@Entity
@Table(name="article")

public class Article  {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    
    Long artId;


    @Column
    String artLi;
    @Column
    String artRef;
    @Column
    String artCd;
    @Column
    Double artPu;
    @Column
    Double artCmp;
    @Column
    Timestamp artDte;
    @Column
    Timestamp artDernMdf;

    

    
    public void setArtId(Long artId){
        this.artId = artId;
    }

    public Long getArtId(){
        return this.artId;
    }


    public void setArtLi(String artLi){
        this.artLi = artLi;
    }

    public String getArtLi(){
        return this.artLi;
    }


    public void setArtRef(String artRef){
        this.artRef = artRef;
    }

    public String getArtRef(){
        return this.artRef;
    }


    public void setArtCd(String artCd){
        this.artCd = artCd;
    }

    public String getArtCd(){
        return this.artCd;
    }


    public void setArtPu(Double artPu){
        this.artPu = artPu;
    }

    public Double getArtPu(){
        return this.artPu;
    }


    public void setArtCmp(Double artCmp){
        this.artCmp = artCmp;
    }

    public Double getArtCmp(){
        return this.artCmp;
    }


    public void setArtDte(Timestamp artDte){
        this.artDte = artDte;
    }

    public Timestamp getArtDte(){
        return this.artDte;
    }


    public void setArtDernMdf(Timestamp artDernMdf){
        this.artDernMdf = artDernMdf;
    }

    public Timestamp getArtDernMdf(){
        return this.artDernMdf;
    }


}