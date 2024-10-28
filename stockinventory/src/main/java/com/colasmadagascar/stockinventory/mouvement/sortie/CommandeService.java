package com.colasmadagascar.stockinventory.mouvement.sortie;

import com.colasmadagascar.stockinventory.currency.CurrencyService;
import com.colasmadagascar.stockinventory.mouvement.MouvementRepository;
import com.colasmadagascar.stockinventory.mouvement.cession.Cession;
import com.colasmadagascar.stockinventory.mouvement.periode.Periode;
import com.colasmadagascar.stockinventory.mouvement.periode.PeriodeRepository;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CommandeService {
    public final CommandeRepository commandeRepository;
    public final PeriodeRepository periodeRepository;
    public final MouvementRepository mouvementRepository;
    public final CurrencyService currencyService;


    public List<CommandeDTO> getAllCommande() {
        return commandeRepository.getAllCommande();
    }

    public CommandeDetailDTO getAllCommandeSortie(Long cmdeId) {
        CommandeDetailDTO dto = new CommandeDetailDTO();
        dto.setInfo(commandeRepository.getCommandeDetails(cmdeId));
        dto.setDetails(mouvementRepository.getAllSortieByCommande(cmdeId));
        dto.setMontantTotal(currencyService.formatCurrency(0));
        return dto;
    }

    public Commande getCommandeById(Long id) {
        return commandeRepository.findById(id).get();
    }

    @Transactional
    public void createCommande(Long emplacementDeId, Long unopAId) {
        Periode periode = periodeRepository.getCurrentActivePeriode();
        Optional<Commande> existance = commandeRepository.findExistance(emplacementDeId, unopAId, periode.getPeriodeId());
        if (existance.isPresent()) {
            throw new IllegalStateException("Cette commande existe deja");
        }
        commandeRepository.persist(emplacementDeId, unopAId, periode.getPeriodeId());
    }


    public Cession getCessionById(Long id) {
        Cession cession = new Cession();
        cession.setInfo(commandeRepository.getSessionInfo(id));
        return cession;
    }
}
