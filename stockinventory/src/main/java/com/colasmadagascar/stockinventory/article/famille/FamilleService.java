package com.colasmadagascar.stockinventory.article.famille;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;


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

    public long count (){
        return familleRepository.count();
    }
    private String createFamilleLogRef(String label) {
        String[] words = label.split(" ");
        StringBuilder sb = new StringBuilder();
        for (String word : words) {
            sb.append(word.toUpperCase().charAt(0)).append(word.toUpperCase().charAt(1));
        }
        return sb.toString();
    }

    public Famille updateEntity(Famille famille) {
        return familleRepository.save(famille);
    }

    public void deleteEntityById(Long id) {
        familleRepository.deleteById(id);
    }


}