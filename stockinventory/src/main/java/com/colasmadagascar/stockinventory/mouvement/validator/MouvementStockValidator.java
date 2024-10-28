package com.colasmadagascar.stockinventory.mouvement.validator;

import com.colasmadagascar.stockinventory.mouvement.MouvementRepository;
import com.colasmadagascar.stockinventory.mouvement.MouvementSortieRequest;
import com.colasmadagascar.stockinventory.mouvement.periode.Periode;
import com.colasmadagascar.stockinventory.mouvement.periode.PeriodeRepository;
import com.colasmadagascar.stockinventory.mouvement.sortie.Commande;
import com.colasmadagascar.stockinventory.mouvement.sortie.CommandeRepository;
import com.colasmadagascar.stockinventory.mouvement.stock.Stock;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.Optional;
import org.springframework.stereotype.Component;

@Component
public class MouvementStockValidator implements ConstraintValidator<MouvementSortieAnnotation, MouvementSortieRequest> {
    private final MouvementRepository repository;
    private final CommandeRepository commandeRepository;
    private final Periode activePeriode;
    private final PeriodeRepository periodeRepository;
    

    public MouvementStockValidator(MouvementRepository repository, CommandeRepository commandeRepository, PeriodeRepository periodeRepository) {
        this.repository = repository;
        this.commandeRepository = commandeRepository;
        this.activePeriode = periodeRepository.getCurrentActivePeriode();
        this.periodeRepository = periodeRepository;
    }

    @Override
    public boolean isValid(MouvementSortieRequest value, ConstraintValidatorContext context) {

        context.disableDefaultConstraintViolation();

        if(value.getArticle() == null){
            context.buildConstraintViolationWithTemplate("Choisissez un article")
                    .addPropertyNode("article")
                    .addConstraintViolation();
            return false;
        }

        if(value.getCommande() == null){
            context.buildConstraintViolationWithTemplate("Commande requis")
                    .addPropertyNode("commande")
                    .addConstraintViolation();
            return false;
        }

        if(value.getQuantite()== null ||value.getQuantite() <=0 ){
            context.buildConstraintViolationWithTemplate("La quantite doit être superieur à 0")
                    .addPropertyNode("quantite")
                    .addConstraintViolation();
            return false;
        }

        Optional<Commande> commande = commandeRepository.findById(value.getCommande());
        if(!commande.isPresent()){
            context.buildConstraintViolationWithTemplate("Commande non existante")
                    .addPropertyNode("commande")
                    .addConstraintViolation();
            return false;
        }

        Stock stock = repository.findExistanceStock(commande.get().getEmplId(), value.getArticle(), activePeriode.getPeriodeId());
        //System.out.println(stock);
        double qteEnStock = (stock == null ? 0:stock.getQuantite()==null?0:stock.getQuantite());
        if(value.getQuantite() > qteEnStock ){

            context.buildConstraintViolationWithTemplate("La quantitée en stock de cette article est insuffisante ")
                    .addPropertyNode("quantite")
                    .addConstraintViolation();
            return false;
        }

        value.setPrixUnitaire(stock.getPrixUnitaire());
        return true;
    }
}
