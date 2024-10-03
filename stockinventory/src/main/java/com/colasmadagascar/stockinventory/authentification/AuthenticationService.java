package com.colasmadagascar.stockinventory.authentification;


import com.colasmadagascar.stockinventory.article.unite.UniteService;
import com.colasmadagascar.stockinventory.configuration.jwt.JwtService;

import com.colasmadagascar.stockinventory.utilisateur.UtilisateurRepository;
import com.colasmadagascar.stockinventory.utilisateur.role.RoleService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleService roleService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UniteService uniteService;


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
                        request.getUsername(),
                        request.getPassword()
                )
        );
        var user = utilisateurRepository.findByUsrLogin(request.getUsername()).orElseThrow();
        HashMap<String,Object> extraClaims = new HashMap<>();
        extraClaims.put("username",user.getFullName());
        extraClaims.put("role",user.getRole().getAuthority());
        var jwtToken = jwtService.generateToken(extraClaims,user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .userFullname(user.getFullName())
                .build();
    }

    @Transactional
    public void createUserData(){


        RegisterRequest request1 = new RegisterRequest();
        request1.setUsername("DOEJOHN4");
        request1.setPassword("test1234!!");
        request1.setNom("DOE");
        request1.setPrenom("John");
        request1.setRoleId(Long.parseLong("2"));
        register(request1);


        register(request1);
    }
}
