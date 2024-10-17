package com.colasmadagascar.stockinventory.livraison;

import com.colasmadagascar.stockinventory.livraison.request.LivraisonCreationRequest;
import com.colasmadagascar.stockinventory.livraison.validator.LivraisonValidation;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/livraisons")
public class LivraisonController {
    @PostMapping
    public ResponseEntity<Object> createLivraison(@RequestBody @Valid LivraisonCreationRequest livraison) {
        Map<String,Object> data = new HashMap<>();
        data.put("message","ok");
        return ResponseEntity.accepted().body(data);
    }
}
