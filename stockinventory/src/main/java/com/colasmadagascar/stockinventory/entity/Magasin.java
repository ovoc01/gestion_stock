package com.colasmadagascar.stockinventory.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.colasmadagascar.stockinventory.utils.Utils;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.ToString;

import java.sql.Timestamp;

@Entity
@Table(name="magasin")
@ToString
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
    Timestamp magDernMdf;

    

    
    public void setMagId(Long magId){
        this.magId = magId;
    }

    public Long getMagId(){
        return this.magId;
    }


    public void setMagLi(String magLi){
        this.magLi = magLi;
    }

    public String getMagLi(){
        return this.magLi;
    }


    public void setMagCom(String magCom){
        this.magCom = magCom;
    }

    public String getMagCom(){
        return this.magCom;
    }


    public void setMagDtCr(LocalDateTime magDtCr){
        this.magDtCr = magDtCr;
    }






    public void setMagDernMdf(Timestamp magDernMdf){
        this.magDernMdf = magDernMdf;
    }

    public Timestamp getMagDernMdf(){
        return this.magDernMdf;
    }



}