package com.colasmadagascar.stockinventory.magasin;

import com.colasmadagascar.stockinventory.magasin.dto.MagasinDetailsDTO;
import com.colasmadagascar.stockinventory.magasin.dto.UtilisateurMagasinDTO;
import com.colasmadagascar.stockinventory.magasin.request.UtilisateurMagasinRequest;
import com.colasmadagascar.stockinventory.shared.Fetch;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.List;

@RestController
@RequestMapping("api/v1/magasins")
public class MagasinController {
    @Autowired
    MagasinService magasinService;

    // @PreAuthorize("hasAuthority('Administrateur')")
    @GetMapping
    public ResponseEntity<Object> getAllMagasin(
            @RequestParam(name = "page", required = false, defaultValue = "1") int page,
            @RequestParam(name = "size", required = false, defaultValue = "5") int size,
            @RequestParam(name = "fetch", defaultValue = "PAGINATION") Fetch fetch) {
        HashMap<String, Object> data = new HashMap<>();
        System.out.println("kjskdjskdjsk");
        try {
            List<Magasin> magasins = magasinService.getAllEntities(size, page, fetch);
            data.put("magasins", magasins);
            data.put("totalPages", magasinService.count());

            return new ResponseEntity<>(data, HttpStatus.OK);
        } catch (Exception e) {
            data.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }

    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> findByIdMagasin(@PathVariable("id") Long id) {
        HashMap<String, Object> data = new HashMap<>();

        try {
            MagasinDetailsDTO magasin = magasinService.getEntityById(id);
            data.put("magasin", magasin);
            return new ResponseEntity<>(data, HttpStatus.OK);
        } catch (Exception e) {
            data.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }

    @PostMapping
    public ResponseEntity<Object> createMagasin(@Valid @RequestBody Magasin magasin) {
        HashMap<String, Object> data = new HashMap<>();
        try {
            magasinService.saveEntity(magasin);
            data.put("message", "Magasin created successfully");
            return new ResponseEntity<>(data, HttpStatus.CREATED);
        } catch (Exception e) {
            data.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateMagasin(@PathVariable("id") Long id,
            @Valid @RequestBody MagasinUpdateRequest magasinUpdateRequest) {
        HashMap<String, Object> data = new HashMap<>();

        try {
            magasinService.updateEntity(magasinUpdateRequest);
            return ResponseEntity.ok("Magasin modifié");
        } catch (Exception e) {
            e.printStackTrace();
            data.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteMagasin(@PathVariable("id") Long id) {
        HashMap<String, Object> data = new HashMap<>();

        try {
            // TODO
            magasinService.deleteEntityById(id);
            data.put("message", "Magasin supprimé");
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            data.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }

    @GetMapping("utilisateurs/{id}")
    public ResponseEntity<Object> getUtilisateursMagasin(@PathVariable("id") Long id) {
        HashMap<String, Object> data = new HashMap<>();

        try {
            // TODO
            List<UtilisateurMagasinDTO> magasinDTOs = magasinService.getUtilisateurMagasins(id);
            data.put("magasins", magasinDTOs);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            data.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }

    @PostMapping("/utilisateurs")
    // @PreAuthorize("hasAuthority('Administrateur')")
    public ResponseEntity<Object> addUtilisateurToMagasin(
            @Valid @RequestBody UtilisateurMagasinRequest uMagasinRequest) {
        HashMap<String, Object> data = new HashMap<>();
        System.out.println("magId : " + uMagasinRequest.getMagId());
        try {
            magasinService.addUtilisateurToMagasin(uMagasinRequest.getUsrId(), uMagasinRequest.getMagId(),
                    uMagasinRequest.getDepuis());
            data.put("message", "Utilisateur ajouté au magasin");
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            e.printStackTrace();
            data.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }
}