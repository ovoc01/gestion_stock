package com.colasmadagascar.stockinventory.article.famille;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;

import static com.colasmadagascar.stockinventory.utils.Utils.createFamilleLogRef;


@Service

public class FamilleService {
    @Autowired
    FamilleRepository familleRepository;


    public List<Famille> getAllEntities(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        return familleRepository.findAll(pageable).toList();
    }


    public Optional<Famille> getEntityById(Long id) {
        return familleRepository.findById(id);
    }


    public Famille saveEntity(Famille famille) {
        famille.setFamLogRef(createFamilleLogRef(famille.getFamilleLi()));
        return familleRepository.save(famille);
    }

    public Famille saveEntity(FamilleRequest familleReq) {
        var famille = Famille
                .builder()
                .familleLi(familleReq.getFamilleLi())
                .famLogRef(createFamilleLogRef(familleReq.getFamilleLi()))
                .build();
        return familleRepository.save(famille);
    }

    public long count (){
        return familleRepository.count();
    }


    public Famille updateEntity(Famille famille) {
        return familleRepository.save(famille);
    }

    public void deleteEntityById(Long id) {
        familleRepository.deleteById(id);
    }


}