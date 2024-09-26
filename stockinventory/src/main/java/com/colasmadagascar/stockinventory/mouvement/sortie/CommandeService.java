package com.colasmadagascar.stockinventory.mouvement.sortie;

import com.colasmadagascar.stockinventory.mouvement.periode.Periode;
import com.colasmadagascar.stockinventory.mouvement.periode.PeriodeRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class CommandeService {
    public final CommandeRepository commandeRepository;
    public final PeriodeRepository periodeRepository;
    public CommandeService (CommandeRepository commandeRepository, PeriodeRepository periodeRepository) {
        this.commandeRepository = commandeRepository;
        this.periodeRepository = periodeRepository;
    }

    public List<CommandeDTO> getAllCommande (){
        return commandeRepository.getAllCommande();
    }

    public Commande getCommandeById(Long id) {
        return commandeRepository.findById(id).get();
    }

    @Transactional
    public void createCommande(Long emplacementDeId,Long unopAId){
        Periode periode = periodeRepository.getCurrentActivePeriode();
        Optional<Commande> existance= commandeRepository.findExistance(emplacementDeId,unopAId,periode.getPeriodeId());
        if(existance.isPresent()){
            throw new IllegalStateException("Cette commande existe deja");
        }
        commandeRepository.persist(emplacementDeId, unopAId,periode.getPeriodeId());
    }
}
