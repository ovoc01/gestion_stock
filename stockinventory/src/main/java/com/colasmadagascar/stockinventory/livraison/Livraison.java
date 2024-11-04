/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.colasmadagascar.stockinventory.livraison;

import com.colasmadagascar.stockinventory.constant.Constant;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.sql.Time;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

/**
 *
 * @author dev
 */

@Entity
@Table(name="livraison")
@Getter
@Setter
@Builder

public class Livraison {
    
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    UUID livraisonId;
    Long periodeId;
    Long fournisseur;
    Long emplId;
    Long saisisseurId;
    String livraisonLi;
    String livraisonBonCmde;
    String livraisonBon;
    String livreur;
    String livreurCin;
    LocalDate livraisonCmdeDt;
    LocalDate livraisonDtEcheance;
    LocalDate livraisonDt;
    Time livraisonHr;
    LocalDateTime livraisonDtSaisie;
    Integer etat;
    
    
    public String getEtat(){
        return Constant.ETAT_LI.get(this.etat);
    }
}
