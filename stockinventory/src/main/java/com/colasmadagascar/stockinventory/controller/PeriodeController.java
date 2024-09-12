package com.colasmadagascar.stockinventory.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import com.colasmadagascar.stockinventory.entity.Periode;
import com.colasmadagascar.stockinventory.service.PeriodeService;

@RestController
@RequestMapping("/periodes")
@CrossOrigin("*")

public class PeriodeController  {
    @Autowired  PeriodeService periodeService;
    
    @GetMapping
    public ResponseEntity<Object> getAllPeriode() {
        HashMap<String,Object> data = new HashMap<>();
        try{
            List<Periode>periodes =  periodeService.getAllEntities();
            data.put("periodes",periodes);
            return new ResponseEntity<>(data, HttpStatus.OK);
        }catch(Exception e){
            data.put("error",e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }

    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> findByIdPeriode(@PathVariable("id")Long id){
        HashMap<String,Object> data = new HashMap<>();

        try{
            Periode periode = periodeService.getEntityById(id).get();
            data.put("periode",periode);
            return new ResponseEntity<>(data, HttpStatus.OK);
        }catch(Exception e){
            data.put("error",e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }


    @PostMapping
    public ResponseEntity<Object> createPeriode(@RequestBody Periode periode){
        HashMap<String,Object> data = new HashMap<>();
        try{
            periodeService.saveEntity(periode);
            data.put("message","Periode created successfully");
            return new ResponseEntity<>(data, HttpStatus.CREATED);
        }catch(Exception e){
            data.put("error",e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<Object> updatePeriode(@PathVariable("id")Long id){
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