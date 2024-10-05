package com.colasmadagascar.stockinventory.authentification;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotNull(message = "Le nom d'utilisateur ne doit pas être null")
    @NotBlank(message = "Le nom d'utilisateur ne doit pas être vide")
    String username;

    @NotNull(message = "Le mot de passe ne doit pas être null")
    @NotBlank(message = "Le mot de passe ne doit pas être vide")
    String password;

    @NotNull(message = "Le prenom ne doit pas être null")
    @NotBlank(message = "Le prenom ne doit pas être vide")
    String prenom;

    @NotNull(message = "Le nom ne doit pas être null")
    @NotBlank(message = "Le nom ne doit pas être vide")
    String nom;

    @NotNull(message = "Le role ne doit pas être null")
    Long roleId;

    Long[] magAffect;
    Long[] servAffect;
}
