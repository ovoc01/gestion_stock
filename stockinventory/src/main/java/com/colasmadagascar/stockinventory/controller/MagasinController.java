package com.colasmadagascar.stockinventory.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import com.colasmadagascar.stockinventory.entity.Magasin;
import com.colasmadagascar.stockinventory.service.MagasinService;

@RestController
@RequestMapping("/magasins")
@CrossOrigin("*")

public class MagasinController  {
    @Autowired  MagasinService magasinService;
    
    @GetMapping
    public ResponseEntity<Object> getAllMagasin(@RequestParam(name = "page",required = false,defaultValue = "1") int page,@RequestParam(name = "size",required = false,defaultValue = "5") int size){
        HashMap<String,Object> data = new HashMap<>();
        Pageable pageable = PageRequest.of(page-1, size);
        try{
            List<Magasin> magasins =  magasinService.getAllEntities(pageable);
            data.put("magasins",magasins);
            data.put("totalPages",magasinService.count());

            return new ResponseEntity<>(data, HttpStatus.OK);
        }catch(Exception e){
            data.put("error",e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }

    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> findByIdMagasin(@PathVariable("id")Long id){
        HashMap<String,Object> data = new HashMap<>();

        try{
            Magasin magasin = magasinService.getEntityById(id).get();
            data.put("magasin",magasin);

            return new ResponseEntity<>(data, HttpStatus.OK);
        }catch(Exception e){
            data.put("error",e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }


    @PostMapping
    public ResponseEntity<Object> createMagasin(@RequestBody Magasin magasin){
        HashMap<String,Object> data = new HashMap<>();
        try{
            magasinService.saveEntity(magasin);
            data.put("message","Magasin created successfully");
            return new ResponseEntity<>(data, HttpStatus.CREATED);
        }catch(Exception e){
            data.put("error",e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<Object> updateMagasin(@PathVariable("id")Long id){
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