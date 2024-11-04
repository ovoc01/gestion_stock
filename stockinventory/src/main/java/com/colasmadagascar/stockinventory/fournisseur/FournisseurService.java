/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.colasmadagascar.stockinventory.fournisseur;

import com.colasmadagascar.stockinventory.shared.Fetch;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 *
 * @author dev
 */
@Service
@RequiredArgsConstructor
public class FournisseurService {
    private final FournisseurRepository fournisseurRepository;
    
    
    public List<Fournisseur> getAllEntities(int pageNumber,int size){
        Pageable page = PageRequest.of(pageNumber, size);
        return fournisseurRepository.findAll(page).toList();
    }
    
    public List<Fournisseur> getAllEntitiesDTO(int page, int size,Fetch fetch) {
        if (fetch == Fetch.ALL)
            return fournisseurRepository.findAll();
        Pageable pageable = PageRequest.of(page - 1, size);
        return fournisseurRepository.findAll(pageable).toList();
    }
    
    public long count (){
        return fournisseurRepository.count();
    }
}
