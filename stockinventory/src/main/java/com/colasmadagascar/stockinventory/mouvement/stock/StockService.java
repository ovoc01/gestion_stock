package com.colasmadagascar.stockinventory.mouvement.stock;

import com.colasmadagascar.stockinventory.mouvement.MouvementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StockService {
    private final MouvementRepository mouvementRepository;

    public double stockValeur (Long magId,Long emplId,String code){

        return mouvementRepository.getValorisation(magId,emplId,code);
    }
}
