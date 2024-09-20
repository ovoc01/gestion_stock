package com.colasmadagascar.stockinventory.magasin.emplacement;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.List;



@RestController
@RequestMapping("api/v1/emplacements")

public class EmplacementController  {
    @Autowired  EmplacementService emplacementService;
    
    @GetMapping
    public ResponseEntity<Object> getAllEmplacement(@RequestParam(name = "page",required = false,defaultValue = "1") int page,@RequestParam(name = "size",required = false,defaultValue = "5") int size) {
        HashMap<String,Object> data = new HashMap<>();
        try{
            List<EmplacementDTO>emplacements =  emplacementService.getAllEntitiesDTO(page, size);
            data.put("emplacements",emplacements);
            data.put("totalPages",emplacementService.count());
            return new ResponseEntity<>(data, HttpStatus.OK);
        }catch(Exception e){
            data.put("error",e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }

    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> findByIdEmplacement(@PathVariable("id")Long id){
        HashMap<String,Object> data = new HashMap<>();

        try{
            Emplacement emplacement = emplacementService.getEntityById(id).get();
            data.put("emplacement",emplacement);
            return new ResponseEntity<>(data, HttpStatus.OK);
        }catch(Exception e){
            data.put("error",e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }


    @PostMapping
    public ResponseEntity<Object> createEmplacement(@Valid  @RequestBody EmplacementRequest emplacement){
        HashMap<String,Object> data = new HashMap<>();
        try{
            emplacementService.createEmplacement(emplacement);
            data.put("message","Emplacement created successfully");
            return new ResponseEntity<>(data, HttpStatus.CREATED);
        }catch(Exception e){
            data.put("error",e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<Object> updateEmplacement(@Valid @RequestBody EmplacementRequest emplacement){
        HashMap<String,Object> data = new HashMap<>();

        try{
            emplacementService.updateEmplacement(emplacement);;
            data.put("message","Emplacement update successfully");
            return new ResponseEntity<>(data, HttpStatus.CREATED);
        }catch(Exception e){
            data.put("error",e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> createEmplacement(@PathVariable("id")Long id){
        HashMap<String,Object> data = new HashMap<>();
        try{
            emplacementService.deleteEntityById(id);;
            data.put("message","Emplacement deleted successfully");
            return new ResponseEntity<>(data, HttpStatus.CREATED);
        }catch(Exception e){
            data.put("error",e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }


}