package com.colasmadagascar.stockinventory.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import com.colasmadagascar.stockinventory.entity.Famille;
import com.colasmadagascar.stockinventory.service.FamilleService;

@RestController
@RequestMapping("/familles")
@CrossOrigin("*")

public class FamilleController  {
    @Autowired  FamilleService familleService;
    
    @GetMapping
    public ResponseEntity<Object> getAllFamille() {
        HashMap<String,Object> data = new HashMap<>();
        try{
            List<Famille>familles =  familleService.getAllEntities();
            data.put("familles",familles);
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
    public ResponseEntity<Object> updateFamille(@PathVariable("id")Long id){
        HashMap<String,Object> data = new HashMap<>();

        try{
            //TODO
            return ResponseEntity.ok("success");
        }catch(Exception e){
            data.put("error",e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }




}