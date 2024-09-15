package com.colasmadagascar.stockinventory.authentification;

import lombok.Data;

@Data
public class RegisterRequest {
    String username;
    String password;
    String prenom;
    String nom;
    Long roleId;
}
