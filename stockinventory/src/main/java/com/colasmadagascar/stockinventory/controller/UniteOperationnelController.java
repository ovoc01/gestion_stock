package com.colasmadagascar.stockinventory.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import com.colasmadagascar.stockinventory.entity.UniteOperationnel;
import com.colasmadagascar.stockinventory.service.UniteOperationnelService;

@RestController
@RequestMapping("/uniteOperationnels")
@CrossOrigin("*")

public class UniteOperationnelController  {
    @Autowired  UniteOperationnelService uniteOperationnelService;
    
    @GetMapping
    public ResponseEntity<Object> getAllUniteOperationnel() {
        HashMap<String,Object> data = new HashMap<>();
        try{
            List<UniteOperationnel>uniteOperationnels =  uniteOperationnelService.getAllEntities();
            data.put("uniteOperationnels",uniteOperationnels);
            return new ResponseEntity<>(data, HttpStatus.OK);
        }catch(Exception e){
            data.put("error",e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }

    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> findByIdUniteOperationnel(@PathVariable("id")Long id){
        HashMap<String,Object> data = new HashMap<>();

        try{
            UniteOperationnel uniteOperationnel = uniteOperationnelService.getEntityById(id).get();
            data.put("uniteOperationnel",uniteOperationnel);
            return new ResponseEntity<>(data, HttpStatus.OK);
        }catch(Exception e){
            data.put("error",e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }


    @PostMapping
    public ResponseEntity<Object> createUniteOperationnel(@RequestBody UniteOperationnel uniteOperationnel){
        HashMap<String,Object> data = new HashMap<>();
        try{
            uniteOperationnelService.saveEntity(uniteOperationnel);
            data.put("message","UniteOperationnel created successfully");
            return new ResponseEntity<>(data, HttpStatus.CREATED);
        }catch(Exception e){
            data.put("error",e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<Object> updateUniteOperationnel(@PathVariable("id")Long id){
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