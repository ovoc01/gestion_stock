package com.colasmadagascar.stockinventory.serviceexp.unop;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;

@Service

public class UniteOperationnelService  {
   @Autowired
   UniteOperationnelRepository uniteOperationnelRepository;

   
   public List<UniteOperationnel> getAllEntities(int page,int size) {
        Pageable pageable = PageRequest.of(page-1, size);
        return uniteOperationnelRepository.findAll(pageable).toList();
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

    public long count(){
        return uniteOperationnelRepository.count();
    }



}