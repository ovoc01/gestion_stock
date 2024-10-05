package com.colasmadagascar.stockinventory.serviceexp.unop;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.colasmadagascar.stockinventory.shared.Fetch;

import java.util.HashMap;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.List;

@RestController
@RequestMapping("api/v1/unite-operationnels")

public class UniteOperationnelController {
    @Autowired
    UniteOperationnelService uniteOperationnelService;

    @GetMapping
    public ResponseEntity<Object> getAllUniteOperationnel(
            @RequestParam(name = "page", required = false, defaultValue = "1") int page,
            @RequestParam(name = "size", required = false, defaultValue = "5") int size,
            @RequestParam(name = "fetch", defaultValue = "PAGINATION") Fetch fetch) {
        HashMap<String, Object> data = new HashMap<>();
        try {
            List<UniteOperationnel> uniteOperationnels = uniteOperationnelService.getAllEntities(page, size,fetch);
            data.put("uniteOperationnels", uniteOperationnels);
            data.put("totalPages", uniteOperationnelService.count());
            return new ResponseEntity<>(data, HttpStatus.OK);
        } catch (Exception e) {
            data.put("error", e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(data);
        }

    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> findByIdUniteOperationnel(@PathVariable("id") Long id) {
        HashMap<String, Object> data = new HashMap<>();

        try {
            UniteOperationnel uniteOperationnel = uniteOperationnelService.getEntityById(id).get();
            data.put("uniteOperationnel", uniteOperationnel);
            return new ResponseEntity<>(data, HttpStatus.OK);
        } catch (Exception e) {
            data.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }

    @PostMapping
    public ResponseEntity<Object> createUniteOperationnel(
            @RequestBody @Valid UniteOperationnelRequest uniteOperationnel) {
        HashMap<String, Object> data = new HashMap<>();
        try {
            uniteOperationnelService.saveEntity(uniteOperationnel);
            data.put("message", "UniteOperationnel created successfully");
            return new ResponseEntity<>(data, HttpStatus.CREATED);
        } catch (Exception e) {
            data.put("error", e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(data);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateUniteOperationnel(
            @RequestBody @Valid UniteOperationnelUpdateRequest uniteOperationnel) {
        HashMap<String, Object> data = new HashMap<>();

        try {
            uniteOperationnelService.updateEntity(uniteOperationnel);
            data.put("message", "UniteOperationnel updated successfully");
            return new ResponseEntity<>(data, HttpStatus.CREATED);
        } catch (Exception e) {
            data.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteUniteOperationnel(@PathVariable("id") Long id) {
        HashMap<String, Object> data = new HashMap<>();
        try {
            uniteOperationnelService.deleteEntityById(id);
            data.put("message", "UniteOperationnel deleted successfully");
            return new ResponseEntity<>(data, HttpStatus.OK);
        } catch (Exception e) {
            data.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }

    }

}