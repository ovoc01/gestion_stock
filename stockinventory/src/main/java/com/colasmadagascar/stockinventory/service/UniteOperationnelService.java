package com.colasmadagascar.stockinventory.service;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.colasmadagascar.stockinventory.entity.UniteOperationnel;
import com.colasmadagascar.stockinventory.repository.UniteOperationnelRepository;

@Service

public class UniteOperationnelService  {
   @Autowired
   UniteOperationnelRepository uniteOperationnelRepository;

   
   public List<UniteOperationnel> getAllEntities() {
        return uniteOperationnelRepository.findAll();
    }


    public Optional<UniteOperationnel> getEntityById(Long id) {
        return uniteOperationnelRepository.findById(id);
    }


    public UniteOperationnel saveEntity(UniteOperationnel uniteOperationnel) {
        return uniteOperationnelRepository.save(uniteOperationnel);
    }


    public UniteOperationnel updateEntity(UniteOperationnel uniteOperationnel) {
        return uniteOperationnelRepository.save(uniteOperationnel);
    }

    public void deleteEntityById(Long id) {
        uniteOperationnelRepository.deleteById(id);
    }



}