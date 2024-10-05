package com.colasmadagascar.stockinventory.mouvement;

import com.colasmadagascar.stockinventory.mouvement.periode.Periode;
import com.colasmadagascar.stockinventory.mouvement.sortie.Commande;
import com.colasmadagascar.stockinventory.mouvement.sortie.CommandeRepository;
import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class MouvementService {
    private final MouvementRepository mouvementRepository;
    private final Periode activePeriode;
    private final CommandeRepository commandeRepository;


    public MouvementService(MouvementRepository mouvementRepository, Periode activePeriode, CommandeRepository commandeRepository) {
        this.mouvementRepository = mouvementRepository;
        this.activePeriode = activePeriode;
        this.commandeRepository = commandeRepository;
    }

    @Transactional
    protected void save(Mouvement mouvement){
        mouvement.setPeriodeId(activePeriode.getPeriodeId());
        mouvementRepository.saveMvt(mouvement);
    }

    @Transactional
    public void createSortie(MouvementSortieRequest request){
        Optional<Commande> commande = commandeRepository.findById(request.getCommande());
        var mouvement = Mouvement.builder()
                .mvtType(10)
                .cmdeLigneQte(request.getQuantite())
                .cmdeId(request.getCommande())
                .emplId(commande.get().getEmplId())
                .artId(request.article)
                .cmdeLignePu(request.getPrixUnitaire())
                .build();
        save(mouvement);
    }

    @Transactional
    public void createEntree(MouvementEntreeRequest mouvement){
        var build = Mouvement.builder()
                .artId(mouvement.article)
                .emplId(mouvement.emplacement)
                .cmdeLigneQte(mouvement.quantite)
                .cmdeLignePu(mouvement.prixUnitaire)
                .mvtType(0)
                .cmdeBc(mouvement.justif)
                .build();
        save(build);
    }

    public List<MouvementDTO> getAllMouvementSortie(){
        return mouvementRepository.getAllSortie();
    }

    public List<MouvementDTO> getAllMouvementEntree(){
        return mouvementRepository.getAllEntree();
    }
}
