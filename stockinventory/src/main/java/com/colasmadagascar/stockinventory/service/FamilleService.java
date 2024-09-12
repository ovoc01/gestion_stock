package com.colasmadagascar.stockinventory.service;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.colasmadagascar.stockinventory.entity.Famille;
import com.colasmadagascar.stockinventory.repository.FamilleRepository;

@Service

public class FamilleService  {
   @Autowired
   FamilleRepository familleRepository;

   
   public List<Famille> getAllEntities() {
        return familleRepository.findAll();
    }


    public Optional<Famille> getEntityById(Long id) {
        return familleRepository.findById(id);
    }


    public Famille saveEntity(Famille famille) {
        return familleRepository.save(famille);
    }


    public Famille updateEntity(Famille famille) {
        return familleRepository.save(famille);
    }

    public void deleteEntityById(Long id) {
        familleRepository.deleteById(id);
    }



}