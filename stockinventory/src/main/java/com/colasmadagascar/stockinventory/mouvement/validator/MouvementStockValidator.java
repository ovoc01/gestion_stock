package com.colasmadagascar.stockinventory.mouvement.validator;

import com.colasmadagascar.stockinventory.mouvement.MouvementRepository;
import com.colasmadagascar.stockinventory.mouvement.MouvementSortieRequest;
import com.colasmadagascar.stockinventory.mouvement.periode.Periode;
import com.colasmadagascar.stockinventory.mouvement.sortie.Commande;
import com.colasmadagascar.stockinventory.mouvement.sortie.CommandeRepository;
import com.colasmadagascar.stockinventory.mouvement.stock.Stock;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class MouvementStockValidator implements ConstraintValidator<MouvementSortieAnnotation, MouvementSortieRequest> {
    private final MouvementRepository repository;
    private final CommandeRepository commandeRepository;
    private final Periode activePeriode;

    public MouvementStockValidator(MouvementRepository repository, CommandeRepository commandeRepository, Periode activePeriode) {
        this.repository = repository;
        this.commandeRepository = commandeRepository;
        this.activePeriode = activePeriode;
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
        if(value.getQuantite() > stock.getQuantite() ){

            context.buildConstraintViolationWithTemplate("La quantite en stock de cette article est insuffisante, il ne reste que "+stock.getQuantite())
                    .addPropertyNode("quantite")
                    .addConstraintViolation();
            return false;
        }

        value.setPrixUnitaire(stock.getPrixUnitaire());
        return true;
    }
}
