package com.colasmadagascar.stockinventory.authentification;


import com.colasmadagascar.stockinventory.configuration.jwt.JwtService;

import com.colasmadagascar.stockinventory.utilisateur.Utilisateur;
import com.colasmadagascar.stockinventory.utilisateur.UtilisateurRepository;
import com.colasmadagascar.stockinventory.utilisateur.role.Role;
import com.colasmadagascar.stockinventory.utilisateur.role.RoleRepository;
import com.colasmadagascar.stockinventory.utilisateur.role.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleService roleService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;


    public void register(RegisterRequest request) {
        if (utilisateurRepository.findByUsrLogin(request.getUsername()).isPresent()) {
            throw new IllegalStateException("Nom d'utilisateur deja utilisé");
        }

        var Role = roleService.getRoleById(request.getRoleId());
        var Utilisateur = com.colasmadagascar.stockinventory.utilisateur.Utilisateur
                .builder()
                .usrNom(request.getNom())
                .usrPrenom(request.getPrenom())
                .usrLogin(request.getUsername())
                .usrPwd(passwordEncoder.encode(request.getPassword()))
                .usrDtCr(new Timestamp(System.currentTimeMillis()))
                .role(Role)
                .build();

        utilisateurRepository.save(Utilisateur);
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getLogin(),
                        request.getPassword()
                )
        );
        var user = utilisateurRepository.findByUsrLogin(request.getLogin()).orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .userFullname(user.getFullName())
                .build();
    }
}
