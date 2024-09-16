package com.colasmadagascar.stockinventory.article.unite;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;

@Service

public class UniteService  {
   @Autowired
   UniteRepository uniteRepository;

   
   public List<Unite> getAllEntities(int page,int size) {
        Pageable pageable = PageRequest.of(page, size);
        return uniteRepository.findAll(pageable).toList();
    }


    public Optional<Unite> getEntityById(Long id) {
        return uniteRepository.findById(id);
    }


    public Unite saveEntity(Unite unite) {
        return uniteRepository.save(unite);
    }


    public Unite updateEntity(Unite unite) {
        return uniteRepository.save(unite);
    }

    public void deleteEntityById(Long id) {
        uniteRepository.deleteById(id);
    }



}