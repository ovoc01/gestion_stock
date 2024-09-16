package com.colasmadagascar.stockinventory.magasin.emplacement;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;

@Service

public class EmplacementService  {
   @Autowired
   EmplacementRepository emplacementRepository;

   
   public List<Emplacement> getAllEntities(int page,int size) {
        Pageable pageable = PageRequest.of(page, size);
        return emplacementRepository.findAll(pageable).toList();
    }


    public Optional<Emplacement> getEntityById(Long id) {
        return emplacementRepository.findById(id);
    }


    public Emplacement saveEntity(Emplacement emplacement) {
        return emplacementRepository.save(emplacement);
    }


    public Emplacement updateEntity(Emplacement emplacement) {
        return emplacementRepository.save(emplacement);
    }

    public void deleteEntityById(Long id) {
        emplacementRepository.deleteById(id);
    }



}