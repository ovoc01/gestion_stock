package com.colasmadagascar.stockinventory.article.sousfamille;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;

@Service

public class SousFamilleService  {
   @Autowired
   SousFamilleRepository sousFamilleRepository;

   
   public List<SousFamilleDTO> getAllEntities(int page,int size) {
        Pageable pageable = PageRequest.of(page-1, size);
        return sousFamilleRepository.findAllSousFamilles(pageable).toList();
    }

    public long count(){
        return sousFamilleRepository.count();
    }

    @Transactional
    public void saveEntity(SousFamilleRequest request){

       sousFamilleRepository.createSousFamille(request.getSousFamLi(),request.getFamilleId());
    }

    @Transactional
    public void updateEntity(SousFamilleRequest request){
        sousFamilleRepository.updateSousFamille(request.getSousFamLi(),request.getFamilleId(),request.getSousFamId());
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