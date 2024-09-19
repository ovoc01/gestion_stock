package com.colasmadagascar.stockinventory.article.famille;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Entity
@Table(name="famille")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Famille  {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    
    Long familleId;

    @Column
    @NotNull(message = "Libellé du famille ne doit pas être null")
    @NotBlank(message ="Libellé du famille ne doit pas être vide" )
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