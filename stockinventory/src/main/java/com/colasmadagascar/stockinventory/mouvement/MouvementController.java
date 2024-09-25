package com.colasmadagascar.stockinventory.mouvement;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("api/v1/mouvements")
public class MouvementController {
    private final MouvementService mouvementService;

    public MouvementController(MouvementService mouvementService) {
        this.mouvementService = mouvementService;
    }

    @PostMapping
    public ResponseEntity<Object> entree(@RequestBody  Mouvement mouvement) {
        Map<String,Object> data = new HashMap<>();
        try{
            mouvementService.save(mouvement);
            data.put("mouvement",mouvement);
            return ResponseEntity.ok(data);
        }catch (Exception e){
            data.put("error",e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }

    @GetMapping("/sorties")
    public ResponseEntity<Object> getAllMouvementSortie(){
        Map<String,Object> data = new HashMap<>();
        try{
            data.put("mouvements",mouvementService.getAllMouvementSortie());
            return ResponseEntity.ok(data);
        }catch (Exception e){
            data.put("error",e.getLocalizedMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }
    @PostMapping("/sorties")
    public ResponseEntity<Object> createSortie( @Valid @RequestBody  MouvementSortieRequest mouvement) {
        Map<String,Object> data = new HashMap<>();
        try{
            mouvementService.createSortie(mouvement);
            data.put("mouvement",mouvement);
            return ResponseEntity.ok(data);
        }catch (Exception e){
            data.put("error",e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }


    @GetMapping("/entrees")
    public ResponseEntity<Object> getAllMouvementEntree(){
        Map<String,Object> data = new HashMap<>();
        try{
            data.put("mouvements",mouvementService.getAllMouvementEntree());
            return ResponseEntity.ok(data);
        }catch (Exception e){
            data.put("error",e.getLocalizedMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }
    @PostMapping("/entrees")
    public ResponseEntity<Object> createEntree(@Valid @RequestBody  MouvementEntreeRequest mouvement) {
        Map<String,Object> data = new HashMap<>();
        try{
            mouvementService.createEntree(mouvement);
            data.put("mouvement",mouvement);
            return ResponseEntity.ok(data);
        }catch (Exception e){
            data.put("error",e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }
}
