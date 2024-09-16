package com.colasmadagascar.stockinventory.article.sousfamille;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.List;



@RestController
@RequestMapping("api/v1/sousFamilles")

public class SousFamilleController  {
    @Autowired  SousFamilleService sousFamilleService;
    
    @GetMapping
    public ResponseEntity<Object> getAllSousFamille(@RequestParam(name = "page",required = false,defaultValue = "1") int page,@RequestParam(name = "size",required = false,defaultValue = "5") int size) {
        HashMap<String,Object> data = new HashMap<>();
        try{
            List<SousFamille>sousFamilles =  sousFamilleService.getAllEntities(page, size);
            data.put("sousFamilles",sousFamilles);
            return new ResponseEntity<>(data, HttpStatus.OK);
        }catch(Exception e){
            data.put("error",e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }

    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> findByIdSousFamille(@PathVariable("id")Long id){
        HashMap<String,Object> data = new HashMap<>();

        try{
            SousFamille sousFamille = sousFamilleService.getEntityById(id).get();
            data.put("sousFamille",sousFamille);
            return new ResponseEntity<>(data, HttpStatus.OK);
        }catch(Exception e){
            data.put("error",e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }


    @PostMapping
    public ResponseEntity<Object> createSousFamille(@RequestBody SousFamille sousFamille){
        HashMap<String,Object> data = new HashMap<>();
        try{
            sousFamilleService.saveEntity(sousFamille);
            data.put("message","SousFamille created successfully");
            return new ResponseEntity<>(data, HttpStatus.CREATED);
        }catch(Exception e){
            data.put("error",e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<Object> updateSousFamille(@RequestBody SousFamille sousFamille){
        HashMap<String,Object> data = new HashMap<>();

        try{
            sousFamilleService.saveEntity(sousFamille);
            data.put("message","SousFamille created successfully");
            return new ResponseEntity<>(data, HttpStatus.CREATED);
        }catch(Exception e){
            data.put("error",e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }




}