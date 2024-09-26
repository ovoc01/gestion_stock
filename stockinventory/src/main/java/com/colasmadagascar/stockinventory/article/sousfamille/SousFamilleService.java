package com.colasmadagascar.stockinventory.article.sousfamille;

import java.util.List;
import java.util.Optional;

import com.colasmadagascar.stockinventory.article.famille.Famille;
import com.colasmadagascar.stockinventory.article.famille.FamilleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;

import static com.colasmadagascar.stockinventory.utils.Utils.createFamilleLogRef;
@Service
@RequiredArgsConstructor
public class SousFamilleService  {

   final SousFamilleRepository sousFamilleRepository;
   final FamilleRepository familleRepository;

   
   public List<SousFamilleDTO> getAllEntities(int page,int size) {
        Pageable pageable = PageRequest.of(page-1, size);
        return sousFamilleRepository.findAllSousFamilles(pageable).toList();
    }

    public long count(){
        return sousFamilleRepository.count();
    }

    @Transactional
    public void saveEntity(SousFamilleRequest request){
        Famille famille = familleRepository.findById(request.getFamilleId()).get();
       sousFamilleRepository.createSousFamille(request.getSousFamLi(),request.getFamilleId(),famille.getFamLogRef()+createFamilleLogRef(request.getSousFamLi()));
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