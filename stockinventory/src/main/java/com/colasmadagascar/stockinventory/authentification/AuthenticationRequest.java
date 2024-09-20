package com.colasmadagascar.stockinventory.authentification;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AuthenticationRequest {
    @NotNull(message = "Le nom d'utilisateur ne doit pas être null")
    @NotBlank(message = "Le nom d'utilisateur ne doit pas être vide")
    String username;

    @NotNull(message = "Le mot de passe ne doit pas être null")
    @NotNull(message = "Le mot de passe ne doit pas être vide")
    String password;
}
