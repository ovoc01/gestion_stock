/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.colasmadagascar.stockinventory.fournisseur;

import com.colasmadagascar.stockinventory.constant.Constant;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Data;

/**
 *
 * @author dev
 */

@Entity
@Data
@Table(name = "fournisseur")
public class Fournisseur {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    Long fournisseurId;
    String fournisseurLi;
    String email;
    String contact;
    Integer etat;
    LocalDateTime fournisseurDtCr;
    LocalDateTime fournisseurDtModif;
    
    
    public String getEtat(){
        return Constant.ETAT_LI.get(this.etat);
    }
}
