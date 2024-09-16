package com.colasmadagascar.stockinventory.mouvement.periode;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;

@Service

public class PeriodeService  {
   @Autowired
   PeriodeRepository periodeRepository;

   
   public List<Periode> getAllEntities(int page,int size) {
        Pageable pageable = PageRequest.of(page-1, size);
        return periodeRepository.findAll(pageable).toList();
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

    public long count(){
        return periodeRepository.count();
    }



}