package com.colasmadagascar.stockinventory.admin;

import java.util.HashMap;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.colasmadagascar.stockinventory.serviceexp.ServiceExploitantService;
import com.colasmadagascar.stockinventory.utilisateur.UtilisateurService;
import com.colasmadagascar.stockinventory.utilisateur.role.RoleService;

@RestController
@RequestMapping("api/v1/admin")
@PreAuthorize("hasAuthority('Administrateur')")
public class AdminController {
   private final UtilisateurService utilisateurService;
   private final RoleService roleService;
   private final ServiceExploitantService serviceExploitantService;

   public AdminController(UtilisateurService utilisateurService, RoleService roleService,
         ServiceExploitantService serviceExploitantService) {
      this.utilisateurService = utilisateurService;
      this.roleService = roleService;
      this.serviceExploitantService = serviceExploitantService;
   }

   @GetMapping("/utilisateurs")
   public ResponseEntity<Object> getAllUtilisateurs(@RequestParam(name = "page", defaultValue = "1") Integer page,
         @RequestParam(name = "size", defaultValue = "5") Integer size) {
      HashMap<String, Object> response = new HashMap<>();
      try {
         response.put("users", utilisateurService.getAllUtilisateur(page, size));
         return ResponseEntity.ok(response);
      } catch (Exception e) {
         response.put("error", e.getMessage());
         e.printStackTrace();
         return ResponseEntity.badRequest().body(response);
      }
   }

   @GetMapping("/utilisateurs/roles")
   public ResponseEntity<Object> getAllUtilisateursRoles() {
      HashMap<String, Object> response = new HashMap<>();
      try {
         response.put("roles", roleService.getAllEntities());
         return ResponseEntity.ok(response);
      } catch (Exception e) {
         response.put("error", e.getMessage());
         e.printStackTrace();
         return ResponseEntity.badRequest().body(response);
      }
   }

   @GetMapping("/utilisateurs/counts")
   public ResponseEntity<Object> countUtilisateurActive() {
      HashMap<String, Object> response = new HashMap<>();
      try {
         response.put("utilisateurs", utilisateurService.count());
         System.out.println(utilisateurService.count());
         return ResponseEntity.ok(response);
      } catch (Exception e) {
         response.put("error", e.getMessage());
         e.printStackTrace();
         return ResponseEntity.badRequest().body(response);
      }
   }

   @GetMapping("/utilisateurs/{id}")
   public ResponseEntity<Object> getUtilisateurById(Long id) {
      HashMap<String, Object> response = new HashMap<>();
      try {
         response.put("user", utilisateurService.getUtilisateurById(id));
         return ResponseEntity.ok(response);
      } catch (Exception e) {
         response.put("error", e.getMessage());
         return ResponseEntity.badRequest().body(response);
      }
   }

}
