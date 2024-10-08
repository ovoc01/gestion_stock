package com.colasmadagascar.stockinventory.mouvement;


import jakarta.persistence.*;
import lombok.*;

import java.sql.Time;
import java.util.Date;

@Entity
@Table(name = "commande_ligne")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Mouvement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
            @Column(name = "cmde_ligne_id")
    Long mvtId;
    Long cmdeLigneQte;
    Long cmdeLignePu;
    Date cmdeLigneDt;
    Time cmdeLigneHr;
    String artNumSerie;
    Integer mvtType;
    Long cmdeId;
    Long emplId;
    Long artId;
    Long periodeId;
    String cmdeBc;
}
