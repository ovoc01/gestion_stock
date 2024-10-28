package com.colasmadagascar.stockinventory.livraison;

import com.colasmadagascar.stockinventory.livraison.request.LivraisonCreationRequest;
import com.colasmadagascar.stockinventory.utilisateur.Utilisateur;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/livraisons")
@RequiredArgsConstructor
public class LivraisonController {
    
    final private LivraisonService livraisonService;
    
    @PostMapping
    public ResponseEntity<Object> createLivraison(@RequestBody @Valid LivraisonCreationRequest livraison,Authentication auth) {
        
        Map<String,Object> data = new HashMap<>();
        try{
            livraisonService.create(livraison,(Utilisateur)auth.getPrincipal());
        data.put("message","Livraison ajouteée");
        return ResponseEntity
                .ok()
                .body(data);
        }catch(Exception e){
            e.printStackTrace();
            data.put("error",e.getLocalizedMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }
}
