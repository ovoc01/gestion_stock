package com.colasmadagascar.stockinventory.magasin.emplacement;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;

@Service

public class EmplacementService {
    @Autowired
    EmplacementRepository emplacementRepository;

    public List<Emplacement> getAllEntities(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
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

    public long count() {
        return emplacementRepository.count();
    }

    @Transactional
    public void createEmplacement(EmplacementRequest request) {
        emplacementRepository.createEmplacement(request.getEmplLi(), request.getServiceId(), request.getMagId());
    }

    public List<EmplacementDTO> getAllEntitiesDTO(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        return emplacementRepository.findAllEmplacementDTO(pageable).toList();
    }

    @Transactional
    public void updateEmplacement(EmplacementUpdateRequest request) {
        emplacementRepository.updateEmplacement(request.getEmplId(), request.getEmplLi(), request.getServiceId(), request.getMagId());
    }
    
}