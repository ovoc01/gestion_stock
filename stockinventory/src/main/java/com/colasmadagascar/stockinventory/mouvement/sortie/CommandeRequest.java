package com.colasmadagascar.stockinventory.mouvement.sortie;


import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CommandeRequest {
    @NotNull(message = "Choisissez un emplacement")
    private Long emplId;
    @NotNull(message = "Choisissez un unité operationnel")
    private Long unopId;
}
