package com.colasmadagascar.stockinventory.magasin;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;


@Entity
@Table(name = "magasin")
@ToString
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Magasin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    Long magId;

    @Column
    @NotBlank(message = "Le libellé du magasin est requis")
    @NotNull(message = "Le libellé du magasin est requis")
    String magLi;
    @Column
    String magCom;

    @Getter
    @Column
    LocalDateTime magDtCr;
    @Column
    LocalDateTime magDernMdf;
}