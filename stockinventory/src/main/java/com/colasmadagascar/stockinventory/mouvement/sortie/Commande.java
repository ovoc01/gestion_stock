package com.colasmadagascar.stockinventory.mouvement.sortie;


import jakarta.persistence.*;
import lombok.*;

import java.sql.Time;
import java.util.Date;

@Entity
@Table
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Commande {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long cmdeId;
    Date cmdeDtCr;

    Time cmdeHrCr;
    Long emplId;
    Long unopId;
}
