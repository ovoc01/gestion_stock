package com.colasmadagascar.stockinventory.article.unite;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.colasmadagascar.stockinventory.shared.Fetch;

import java.util.HashMap;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.List;

@RestController
@RequestMapping("api/v1/unites")

public class UniteController {
    @Autowired
    UniteService uniteService;

    @GetMapping
    public ResponseEntity<Object> getAllUnite(
            @RequestParam(name = "page", required = false, defaultValue = "1") int page,
            @RequestParam(name = "size", required = false, defaultValue = "5") int size,
            @RequestParam(name = "fetch", defaultValue = "PAGINATION") Fetch fetch) {
        HashMap<String, Object> data = new HashMap<>();
        try {
            List<Unite> unites = uniteService.getAllEntities(page, size, fetch);
            data.put("unites", unites);
            data.put("totalPages", uniteService.count());
            return new ResponseEntity<>(data, HttpStatus.OK);
        } catch (Exception e) {
            data.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }

    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> findByIdUnite(@PathVariable("id") Long id) {
        HashMap<String, Object> data = new HashMap<>();

        try {
            Unite unite = uniteService.getEntityById(id).get();
            data.put("unite", unite);
            return new ResponseEntity<>(data, HttpStatus.OK);
        } catch (Exception e) {
            data.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }

    @PostMapping
    public ResponseEntity<Object> createUnite(@RequestBody Unite unite) {
        HashMap<String, Object> data = new HashMap<>();
        try {
            uniteService.saveEntity(unite);
            data.put("message", "Unite created successfully");
            return new ResponseEntity<>(data, HttpStatus.CREATED);
        } catch (Exception e) {
            data.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateUnite(@RequestBody Unite unite) {
        HashMap<String, Object> data = new HashMap<>();

        try {
            uniteService.saveEntity(unite);
            data.put("message", "Unite updated successfully");
            return new ResponseEntity<>(data, HttpStatus.CREATED);
        } catch (Exception e) {
            data.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteUnite(@PathVariable("id") Long id) {
        HashMap<String, Object> data = new HashMap<>();

        try {
            uniteService.deleteEntityById(id);
            data.put("message", "Unite deleted successfully");
            return new ResponseEntity<>(data, HttpStatus.OK);
        } catch (Exception e) {
            data.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }

}