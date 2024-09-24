package com.colasmadagascar.stockinventory.mouvement.sortie;


import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/mouvements/commandes")
public class CommandeController {
    private final CommandeService commandeService;

    public CommandeController(CommandeService commandeService) {
        this.commandeService = commandeService;
    }

    @GetMapping
    public ResponseEntity<Object> getAllCommande() {
        Map<String,Object> data = new HashMap<>();
        try{
            data.put("commandes",commandeService.getAllCommande());
            return ResponseEntity.ok(data);
        }catch(Exception e){
            data.put("error",e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }

    @PostMapping
    @PreAuthorize("hasAuthority('Administrateur')")
    public ResponseEntity<Object> createCommande(@RequestBody CommandeRequest request){
        Map<String,Object> data = new HashMap<>();
        try{
            commandeService.createCommande(request.getEmplId(),request.getUnopId());
            data.put("message","Commande created successfully");
            return ResponseEntity.ok(data);
        }catch(Exception e){
            data.put("error",e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }
}
