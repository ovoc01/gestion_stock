package com.colasmadagascar.stockinventory.article.sousfamille;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

@Service

public class SousFamilleService  {
   @Autowired
   SousFamilleRepository sousFamilleRepository;

   
   public List<SousFamille> getAllEntities() {
        return sousFamilleRepository.findAll();
    }


    public Optional<SousFamille> getEntityById(Long id) {
        return sousFamilleRepository.findById(id);
    }


    public SousFamille saveEntity(SousFamille sousFamille) {
        return sousFamilleRepository.save(sousFamille);
    }


    public SousFamille updateEntity(SousFamille sousFamille) {
        return sousFamilleRepository.save(sousFamille);
    }

    public void deleteEntityById(Long id) {
        sousFamilleRepository.deleteById(id);
    }



}