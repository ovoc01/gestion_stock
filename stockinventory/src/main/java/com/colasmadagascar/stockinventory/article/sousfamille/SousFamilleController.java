package com.colasmadagascar.stockinventory.article.sousfamille;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.colasmadagascar.stockinventory.shared.Fetch;

import java.util.HashMap;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.List;

@RestController
@RequestMapping("api/v1/sous-familles")

public class SousFamilleController {
    @Autowired
    SousFamilleService sousFamilleService;

    @GetMapping
    public ResponseEntity<Object> getAllSousFamille(
            @RequestParam(name = "page", required = false, defaultValue = "1") int page,
            @RequestParam(name = "size", required = false, defaultValue = "5") int size,
            @RequestParam(name = "fetch", defaultValue = "PAGINATION") Fetch fetch) {
        HashMap<String, Object> data = new HashMap<>();
        try {
            List<SousFamilleDTO> sousFamilles = sousFamilleService.getAllEntities(page, size,fetch);
            data.put("sousFamilles", sousFamilles);
            data.put("totalPages", sousFamilleService.count());
            return new ResponseEntity<>(data, HttpStatus.OK);
        } catch (Exception e) {
            data.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }

    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> findByIdSousFamille(@PathVariable("id") Long id) {
        HashMap<String, Object> data = new HashMap<>();

        try {
            SousFamille sousFamille = sousFamilleService.getEntityById(id).get();
            data.put("sousFamille", sousFamille);
            return new ResponseEntity<>(data, HttpStatus.OK);
        } catch (Exception e) {
            data.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }

    @PostMapping
    public ResponseEntity<Object> createSousFamille(@Valid @RequestBody SousFamilleRequest sousFamille) {
        HashMap<String, Object> data = new HashMap<>();
        try {
            sousFamilleService.saveEntity(sousFamille);
            data.put("message", "SousFamille created successfully");
            return new ResponseEntity<>(data, HttpStatus.CREATED);
        } catch (Exception e) {
            data.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateSousFamille(@Valid @RequestBody SousFamilleRequest sousFamille) {
        HashMap<String, Object> data = new HashMap<>();

        try {
            sousFamilleService.updateEntity(sousFamille);
            data.put("message", "SousFamille updated successfully");
            return new ResponseEntity<>(data, HttpStatus.CREATED);
        } catch (Exception e) {
            data.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteSousFamille(@PathVariable("id") Long id) {
        HashMap<String, Object> data = new HashMap<>();
        try {
            sousFamilleService.deleteEntityById(id);
            data.put("message", "SousFamille deleted successfully");
            return new ResponseEntity<>(data, HttpStatus.OK);
        } catch (Exception e) {
            data.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }

}