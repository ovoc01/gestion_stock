package com.colasmadagascar.stockinventory.authentification;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthenticationResponse {
    String token;
    String userFullname;
}
