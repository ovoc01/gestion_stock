package com.colasmadagascar.stockinventory.authentification;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("api/v1/auth")
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;

    }

    @PostMapping("/register")
    //@PreAuthorize("hasAuthority('Administrateur')")
    public ResponseEntity<Object> register(@Valid @RequestBody RegisterRequest register) {
        HashMap<String, Object> map = new HashMap<>();
        try {

            authenticationService.register(register);
            map.put("message", "Utilisateur créée avec succes");
            return new ResponseEntity<>(map, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            map.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(map);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@Valid @RequestBody AuthenticationRequest authRequest) {

        HashMap<String, Object> map = new HashMap<>();
        System.out.println("bogoss");
        try {
            return ResponseEntity.ok(authenticationService.authenticate(authRequest));
        } catch (Exception e) {
            map.put("error", e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(map);
        }
    }

    @PostMapping("/user-session-validity")
    public ResponseEntity<Object> checkUserSessionValidity(Authentication authentication) {

        System.out.println(authentication);
        return ResponseEntity.accepted().body("ok");
    }

}
