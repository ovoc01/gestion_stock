package com.colasmadagascar.stockinventory.service;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.colasmadagascar.stockinventory.entity.Periode;
import com.colasmadagascar.stockinventory.repository.PeriodeRepository;

@Service

public class PeriodeService  {
   @Autowired
   PeriodeRepository periodeRepository;

   
   public List<Periode> getAllEntities() {
        return periodeRepository.findAll();
    }


    public Optional<Periode> getEntityById(Long id) {
        return periodeRepository.findById(id);
    }


    public Periode saveEntity(Periode periode) {
        return periodeRepository.save(periode);
    }


    public Periode updateEntity(Periode periode) {
        return periodeRepository.save(periode);
    }

    public void deleteEntityById(Long id) {
        periodeRepository.deleteById(id);
    }



}