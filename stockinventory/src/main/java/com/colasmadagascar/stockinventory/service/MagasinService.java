package com.colasmadagascar.stockinventory.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.colasmadagascar.stockinventory.entity.Magasin;
import com.colasmadagascar.stockinventory.repository.MagasinRepository;

@Service

public class MagasinService  {
   @Autowired
   MagasinRepository magasinRepository;

   
   public List<Magasin> getAllEntities() {
        return magasinRepository.findAll();
    }

    public List<Magasin> getAllEntities(Pageable pageable){
       return magasinRepository.findAll(pageable).toList();
    }

    public long count (){
       return magasinRepository.count();
    }


    public Optional<Magasin> getEntityById(Long id) {
        return magasinRepository.findById(id);
    }


    public Magasin saveEntity(Magasin magasin) {
        return magasinRepository.save(magasin);
    }


    public Magasin updateEntity(Magasin magasin) {
        return magasinRepository.save(magasin);
    }

    public void deleteEntityById(Long id) {
        magasinRepository.deleteById(id);
    }



}