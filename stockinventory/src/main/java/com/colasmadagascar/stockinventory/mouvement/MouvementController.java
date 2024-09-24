package com.colasmadagascar.stockinventory.mouvement;

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
    public ResponseEntity<Object> createSortie(@RequestBody  Mouvement mouvement) {
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
}
