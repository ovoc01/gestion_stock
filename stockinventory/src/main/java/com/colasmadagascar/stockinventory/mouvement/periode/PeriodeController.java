package com.colasmadagascar.stockinventory.mouvement.periode;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.List;

@RestController
@RequestMapping("api/v1/periodes")

public class PeriodeController  {
    @Autowired  PeriodeService periodeService;
    
    @GetMapping
    public ResponseEntity<Object> getAllPeriode(@RequestParam(name = "page",required = false,defaultValue = "1") int page,@RequestParam(name = "size",required = false,defaultValue = "5") int size) {
        HashMap<String,Object> data = new HashMap<>();
        try{
            List<Periode>periodes =  periodeService.getAllEntities(page,size);
            data.put("periodes",periodes);
            data.put("totalPages",periodeService.count());
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
    public ResponseEntity<Object> updatePeriode(@RequestBody Periode periode){
        HashMap<String,Object> data = new HashMap<>();

        try{
            periodeService.saveEntity(periode);
            data.put("message","Periode updated successfully");
            return new ResponseEntity<>(data, HttpStatus.CREATED);
        }catch(Exception e){
            data.put("error",e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletePeriode(@PathVariable("id")Long id){
        HashMap<String,Object> data = new HashMap<>();
        try{
            periodeService.deleteEntityById(id);
            data.put("message","Periode deleted successfully");
            return new ResponseEntity<>(data, HttpStatus.OK);
        }catch(Exception e){
            data.put("error",e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    
    }




}