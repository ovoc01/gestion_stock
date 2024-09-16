package com.colasmadagascar.stockinventory.article.famille;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.List;



@RestController
@RequestMapping("api/v1/familles")

public class FamilleController  {
    @Autowired  FamilleService familleService;
    
    @GetMapping
    public ResponseEntity<Object> getAllFamille(@RequestParam(name = "page",required = false,defaultValue = "1") int page,@RequestParam(name = "size",required = false,defaultValue = "5") int size) {
        HashMap<String,Object> data = new HashMap<>();
        try{
            List<Famille>familles =  familleService.getAllEntities(page, size);
            data.put("familles",familles);
            data.put("totalPages",familleService.count());
            return new ResponseEntity<>(data, HttpStatus.OK);
        }catch(Exception e){
            data.put("error",e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }

    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> findByIdFamille(@PathVariable("id")Long id){
        HashMap<String,Object> data = new HashMap<>();

        try{
            Famille famille = familleService.getEntityById(id).get();
            data.put("famille",famille);
            return new ResponseEntity<>(data, HttpStatus.OK);
        }catch(Exception e){
            data.put("error",e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }


    @PostMapping
    public ResponseEntity<Object> createFamille(@RequestBody Famille famille){
        HashMap<String,Object> data = new HashMap<>();
        try{
            familleService.saveEntity(famille);
            data.put("message","Famille created successfully");
            return new ResponseEntity<>(data, HttpStatus.CREATED);
        }catch(Exception e){
            data.put("error",e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<Object> updateFamille(@RequestBody Famille famille){
        HashMap<String,Object> data = new HashMap<>();

        try{
            familleService.saveEntity(famille);
            data.put("message","Famille created successfully");
            return new ResponseEntity<>(data, HttpStatus.CREATED);
        }catch(Exception e){
            data.put("error",e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteFamille(@PathVariable("id")Long id){
        HashMap<String,Object> data = new HashMap<>();
        try{
            familleService.deleteEntityById(id);
            data.put("message","Famille deleted successfully");
            return new ResponseEntity<>(data, HttpStatus.CREATED);
        }catch(Exception e){
            e.printStackTrace();
            data.put("error",e.getLocalizedMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }
}