package com.colasmadagascar.stockinventory.magasin;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

@Service

public class MagasinService  {
   @Autowired
   MagasinRepository magasinRepository;

   
   public List<Magasin> getAllEntities() {
        return magasinRepository.findAll();
    }

    public List<Magasin> getAllEntities(int size,int page){
        Pageable pageable = PageRequest.of(page-1, size, Sort.by("magId").ascending());
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


    public Magasin updateEntity(MagasinUpdateRequest magasinUpdateRequest) {
       var magasin = Magasin
               .builder()
               .magId(magasinUpdateRequest.getMagId())
               .magLi(magasinUpdateRequest.getMagLi())
               .magDtCr(magasinUpdateRequest.getMagDtCr())
               .magDernMdf(LocalDateTime.now())
               .build();

        return magasinRepository.save(magasin);
    }

    public void deleteEntityById(Long id) {
        magasinRepository.deleteById(id);
    }



}