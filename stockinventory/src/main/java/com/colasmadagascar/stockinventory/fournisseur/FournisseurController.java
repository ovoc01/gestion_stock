/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.colasmadagascar.stockinventory.fournisseur;

import com.colasmadagascar.stockinventory.shared.Fetch;
import java.util.HashMap;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author dev
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/fournisseurs")
public class FournisseurController {
    private final FournisseurService fournisseurService;
    
    
    @GetMapping
    public ResponseEntity<Object> getAllArticles(
        @RequestParam(name = "page",required = false,defaultValue = "1") int page,
        @RequestParam(name = "size",required = false,defaultValue = "5") int size,
        @RequestParam(name="fetch",defaultValue = "PAGINATION",required=false) Fetch fetch) {
        HashMap<String,Object> data = new HashMap<>();
        try{
            List<Fournisseur>fournisseurs =  fournisseurService.getAllEntitiesDTO(page, size, fetch);
            data.put("fournisseurs",fournisseurs);
            data.put("totalPages",fournisseurService.count());
            data.put("counts",fournisseurService.count());
            return new ResponseEntity<>(data, HttpStatus.OK);
        }catch(Exception e){
            data.put("error",e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }

    }
}
