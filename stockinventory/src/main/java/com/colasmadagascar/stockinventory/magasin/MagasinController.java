package com.colasmadagascar.stockinventory.magasin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.HttpStatus;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("api/v1/magasins")
@CrossOrigin("*")
public class MagasinController  {
    @Autowired  MagasinService magasinService;
    

    //@PreAuthorize("hasAuthority('Administrateur')")
    @GetMapping
    public ResponseEntity<Object> getAllMagasin(@RequestParam(name = "page",required = false,defaultValue = "1") int page,@RequestParam(name = "size",required = false,defaultValue = "5") int size){
        HashMap<String,Object> data = new HashMap<>();
        try{
            List<Magasin> magasins =  magasinService.getAllEntities(size,page);
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
    public ResponseEntity<Object> updateMagasin(@PathVariable("id")Long id,@RequestBody  MagasinUpdateRequest magasinUpdateRequest){
        HashMap<String,Object> data = new HashMap<>();

        try{
            magasinService.updateEntity(magasinUpdateRequest);
            return ResponseEntity.ok("Magasin modifié");
        }catch(Exception e){
            e.printStackTrace();
            data.put("error",e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteMagasin(@PathVariable("id")Long id){
        HashMap<String,Object> data = new HashMap<>();

        try{
            //TODO
            magasinService.deleteEntityById(id);
            data.put("message","Magasin supprimé");
            return ResponseEntity.ok(data);
        }catch(Exception e){
            data.put("error",e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }




}