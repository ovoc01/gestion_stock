package com.colasmadagascar.stockinventory.livraison.validator;

import com.colasmadagascar.stockinventory.livraison.request.LivraisonCreationRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.stereotype.Component;

@Component
public class LivraisonValidation implements ConstraintValidator<ValidateLivraison, LivraisonCreationRequest> {
    @Override
    public boolean isValid(LivraisonCreationRequest value, ConstraintValidatorContext context) {
        context.disableDefaultConstraintViolation();

        if (value.getFournisseur() == null) {
            context.buildConstraintViolationWithTemplate("Le fournisseur est obligatoire")
                    .addPropertyNode("fournisseur")
                    .addConstraintViolation();
           return false;
        }

        if(value.getLivreur() == null || value.getLivreur().trim().isBlank()){
            context.buildConstraintViolationWithTemplate("Le livreur est obligatoire")
                    .addPropertyNode("livreur")
                    .addConstraintViolation();
            return false;
        }

        if(value.getCin() == null || value.getCin().trim().isBlank()){
            context.buildConstraintViolationWithTemplate("Le cin est obligatoire")
                    .addPropertyNode("cin")
                    .addConstraintViolation();
            return false;
        }

        if(value.getBonLivraison() == null || value.getBonLivraison().trim().isBlank()){
            context.buildConstraintViolationWithTemplate("Le bon de livraison est obligatoire")
                    .addPropertyNode("bonLivraison")
                    .addConstraintViolation();
            return false;
        }

        if(value.getDateLivraison() == null){
            context.buildConstraintViolationWithTemplate("La date de livraison est obligatoire")
                    .addPropertyNode("dateLivraison")
                    .addConstraintViolation();
            return false;
        }

        if(value.getDateEcheance() == null){
            context.buildConstraintViolationWithTemplate("La date d'écheance est obligatoire")
                    .addPropertyNode("dateEcheance")
                    .addConstraintViolation();
            return false;
        }

        if(value.getDateEcheance().isBefore(value.getDateLivraison())){
            context.buildConstraintViolationWithTemplate("La date d'écheance doit être superieur à la date de livraison")
                    .addPropertyNode("dateEcheance")
                    .addConstraintViolation();
            return false;
        }

        if(value.getBonCommande() == null || value.getBonCommande().trim().isBlank()){
            context.buildConstraintViolationWithTemplate("Le bon de commande est obligatoire")
                    .addPropertyNode("bonCommande")
                    .addConstraintViolation();
            return false;
        }

        if(value.getDateCommande() == null){
            context.buildConstraintViolationWithTemplate("La date de commande est obligatoire")
                    .addPropertyNode("dateCommande")
                    .addConstraintViolation();
            return false;
        }

        if(value.getDateCommande().isAfter(value.getDateEcheance())){
            context.buildConstraintViolationWithTemplate("La date de commande doit être avant à la date d'écheance")
                    .addPropertyNode("dateCommande")
                    .addConstraintViolation();
            return false;

        }

        if(value.getDateCommande().isAfter(value.getDateLivraison())){
            context.buildConstraintViolationWithTemplate("La date de commande doit être avant à la date de livraison")
                    .addPropertyNode("dateCommande")
                    .addConstraintViolation();
            return false;

        }

        return true;
    }
}
