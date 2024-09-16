package com.colasmadagascar.stockinventory.mouvement.periode;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.Table;

import java.sql.Date;

@Entity
@Table(name="periode")

public class Periode  {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    
    Long periodeId;

    @Column
    String periodeLi;
    @Column
    Date periodeDtDb;
    @Column
    Date periodeDtFin;
    @Column
    Integer periodeEtat;

    

    
    public void setPeriodeId(Long periodeId){
        this.periodeId = periodeId;
    }

    public Long getPeriodeId(){
        return this.periodeId;
    }


    public void setPeriodeLi(String periodeLi){
        this.periodeLi = periodeLi;
    }

    public String getPeriodeLi(){
        return this.periodeLi;
    }


    public void setPeriodeDtDb(Date periodeDtDb){
        this.periodeDtDb = periodeDtDb;
    }

    public Date getPeriodeDtDb(){
        return this.periodeDtDb;
    }


    public void setPeriodeDtFin(Date periodeDtFin){
        this.periodeDtFin = periodeDtFin;
    }

    public Date getPeriodeDtFin(){
        return this.periodeDtFin;
    }


    public void setPeriodeEtat(Integer periodeEtat){
        this.periodeEtat = periodeEtat;
    }

    public Integer getPeriodeEtat(){
        return this.periodeEtat;
    }



}