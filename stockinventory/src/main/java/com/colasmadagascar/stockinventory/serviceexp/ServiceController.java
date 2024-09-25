package com.colasmadagascar.stockinventory.serviceexp;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.HttpStatus;
import java.util.List;

@RestController
@RequestMapping("api/v1/service-exploitants")

public class ServiceController {
    @Autowired
    ServiceExploitantService serviceService;

    @GetMapping
    public ResponseEntity<Object> getAllService(
            @RequestParam(name = "page", required = false, defaultValue = "1") int page,
            @RequestParam(name = "size", required = false, defaultValue = "5") int size) {
        HashMap<String, Object> data = new HashMap<>();
        try {
            List<ServiceExploitant> services = serviceService.getAllEntities(page, size);
            data.put("serviceExploitants", services);
            data.put("totalPages", serviceService.count());
            return new ResponseEntity<>(data, HttpStatus.OK);
        } catch (Exception e) {
            data.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }

    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> findByIdService(@PathVariable("id") Long id) {
        HashMap<String, Object> data = new HashMap<>();

        try {
            ServiceExploitant service = serviceService.getEntityById(id).get();
            data.put("service", service);
            return new ResponseEntity<>(data, HttpStatus.OK);
        } catch (Exception e) {
            data.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }

    @PostMapping
    public ResponseEntity<Object> createService(@Valid @RequestBody ServiceExploitant service) {
        HashMap<String, Object> data = new HashMap<>();
        try {
            serviceService.saveEntity(service);
            data.put("message", "Service created successfully");
            return new ResponseEntity<>(data, HttpStatus.CREATED);
        } catch (Exception e) {
            data.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateService(@Valid @RequestBody ServiceExploitant service) {
        HashMap<String, Object> data = new HashMap<>();

        try {
            serviceService.saveEntity(service);
            data.put("message", "Service updated successfully");
            return new ResponseEntity<>(data, HttpStatus.CREATED);
        } catch (Exception e) {
            data.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteService(@PathVariable("id") Long id) {
        HashMap<String, Object> data = new HashMap<>();
        try {
            serviceService.deleteEntityById(id);
            data.put("message", "Service deleted successfully");
            return new ResponseEntity<>(data, HttpStatus.OK);
        } catch (Exception e) {
            data.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }

    }

    @GetMapping("/utilisateurs/{usrId}")

    public ResponseEntity<Object> getAllUtilisateursServices(@PathVariable("usrId") Long id) {
        HashMap<String, Object> response = new HashMap<>();
        try {
            response.put("services", serviceService.getUtilisateurService(id));
            // response.put("services", null);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("{id}/utilisateurs/{usrId}")
    @PreAuthorize("hasAuthority('Administrateur')")
    public ResponseEntity<Object> addUtilisateurService(@PathVariable("usrId") Long usrId, @PathVariable("id") Long serviceId) {

        HashMap<String, Object> response = new HashMap<>();
        try {
            serviceService.addUtilisateurToService(usrId, serviceId);
            response.put("message", "Service added successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

}