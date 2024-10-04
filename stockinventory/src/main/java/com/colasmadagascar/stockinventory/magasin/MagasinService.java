package com.colasmadagascar.stockinventory.magasin;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.colasmadagascar.stockinventory.magasin.dto.MagasinDetailsDTO;
import com.colasmadagascar.stockinventory.magasin.dto.UtilisateurMagasinDTO;
import com.colasmadagascar.stockinventory.utils.Utils;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;

@Service

public class MagasinService {
    @Autowired
    MagasinRepository magasinRepository;

    public List<Magasin> getAllEntities() {
        return magasinRepository.findAll();
    }

    public List<Magasin> getAllEntities(int size, int page) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("magId").ascending());
        return magasinRepository.findAll(pageable).toList();
    }

    public long count() {
        return magasinRepository.count();
    }

    public MagasinDetailsDTO getEntityById(Long id) {
        MagasinInfo info = magasinRepository.getMagasinDetailsInfo(id);
        MagasinDetailsDTO dto = new MagasinDetailsDTO();
        System.out.println(Utils.formatTimestamp(info.getDateCreation()));
        dto.setInfo(info);
        dto.setStocks(magasinRepository.getStockParEmplacement(id));
        dto.setValorisations(magasinRepository.getValorisationMagasin(id));
        return dto;
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


    @Transactional
    public void addUtilisateurToMagasin(Long usrId, Long magId) {
        magasinRepository.addUtilisateurToMagasin(magId, usrId);
    }

    @Transactional
    public void addUtilisateurToMagasin(Long usrId,Long[] magIds){
        if(magIds == null) return;
        for (Long id:magIds){
            magasinRepository.addUtilisateurToMagasin(id, usrId);
        }
    }

    public List<UtilisateurMagasinDTO> getUtilisateurMagasins(Long usrId) {
        return magasinRepository.getUtilisateurMagasin(usrId);
    }

}