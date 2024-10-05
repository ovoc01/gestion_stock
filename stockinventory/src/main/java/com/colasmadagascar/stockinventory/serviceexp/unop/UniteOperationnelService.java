package com.colasmadagascar.stockinventory.serviceexp.unop;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

import com.colasmadagascar.stockinventory.shared.Fetch;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;

@Service

public class UniteOperationnelService {
    @Autowired
    UniteOperationnelRepository uniteOperationnelRepository;

    public List<UniteOperationnel> getAllEntities(int page, int size, Fetch fetch) {
        if (fetch == Fetch.ALL)
            return uniteOperationnelRepository.findAll();
        Pageable pageable = PageRequest.of(page - 1, size);
        return uniteOperationnelRepository.findAll(pageable).toList();
    }

    public Optional<UniteOperationnel> getEntityById(Long id) {
        return uniteOperationnelRepository.findById(id);
    }

    public UniteOperationnel saveEntity(UniteOperationnelRequest request) {
        UniteOperationnel unop = UniteOperationnel
                .builder()
                .unopLi(request.unopLi)
                .unopUe(request.unopUe)
                .unopUeLi(request.unopUeLi)
                .unopLiNumAff(request.unopLiNumAff)
                .unopNumBu(request.unopNumBu)
                .unopLng(request.unopLng)
                .unopLtd(request.unopLtd)
                .unopMdmId(request.getUnopMdmId())

                .build();

        return uniteOperationnelRepository.save(unop);
    }

    public UniteOperationnel updateEntity(UniteOperationnelUpdateRequest request) {
        UniteOperationnel unop = UniteOperationnel
                .builder()
                .unopLi(request.unopLi)
                .unopUe(request.unopUe)
                .unopUeLi(request.unopUeLi)
                .unopLiNumAff(request.unopLiNumAff)
                .unopNumBu(request.unopNumBu)
                .unopLng(request.unopLng)
                .unopLtd(request.unopLtd)

                .unopId(request.unopId)
                .unopMdmId(request.getUnopMdmId())
                .build();
        return uniteOperationnelRepository.save(unop);
    }

    public void deleteEntityById(Long id) {
        uniteOperationnelRepository.deleteById(id);
    }

    public long count() {
        return uniteOperationnelRepository.count();
    }

}