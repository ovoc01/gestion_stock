package com.colasmadagascar.stockinventory.mouvement;

import com.colasmadagascar.stockinventory.mouvement.periode.Periode;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.util.Date;
import java.util.List;


@Service
public class MouvementService {
    private final MouvementRepository mouvementRepository;
    private final Periode activePeriode;


    public MouvementService(MouvementRepository mouvementRepository, Periode activePeriode) {
        this.mouvementRepository = mouvementRepository;
        this.activePeriode = activePeriode;
    }

    @Transactional
    protected void save(Mouvement mouvement){
        mouvement.setPeriodeId(activePeriode.getPeriodeId());
        mouvementRepository.saveMvt(mouvement);
    }

    @Transactional
    public void createSortie(Mouvement mouvement){
        mouvement.setMvtType(0);
        save(mouvement);
    }

    public List<MouvementDTO> getAllMouvementSortie(){
        return mouvementRepository.getAllSortie();
    }
}
