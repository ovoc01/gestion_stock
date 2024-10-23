package com.colasmadagascar.stockinventory.livraison.validator;

import com.colasmadagascar.stockinventory.livraison.request.LivraisonCreationRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.time.LocalDate;
import org.springframework.stereotype.Component;

@Component
public class LivraisonValidation implements ConstraintValidator<ValidateLivraison, LivraisonCreationRequest> {

    @Override
    public boolean isValid(LivraisonCreationRequest value, ConstraintValidatorContext context) {
        context.disableDefaultConstraintViolation();

        boolean isValid = true;

        isValid &= validateFournisseur(value.getFournisseur(), context);
        isValid &= validateLivreur(value.getLivreur(), context);
        isValid &= validateCin(value.getCin(), context);
        isValid &= validateBonLivraison(value.getBonLivraison(), context);
        isValid &= validateDateLivraison(value.getDateLivraison(), context);
        isValid &= validateDateEcheance(value.getDateEcheance(), value.getDateLivraison(), context);
        isValid &= validateBonCommande(value.getBonCommande(), context);
        isValid &= validateDateCommande(value.getDateCommande(), value.getDateEcheance(), value.getDateLivraison(),
                context);
        return isValid;
    }

    
    private boolean validateFournisseur(Long fournisseur, ConstraintValidatorContext context) {
        if (fournisseur == null) {
            addConstraintViolation(context, "Le fournisseur est obligatoire", "fournisseur");
            return false;
        }
        return true;
    }

    private boolean validateLivreur(String livreur, ConstraintValidatorContext context) {
        if (livreur == null || livreur.trim().isBlank()) {
            
            addConstraintViolation(context, "Le livreur est obligatoire", "livreur");
            return false;
        }
        return true;
    }

    private boolean validateCin(String cin, ConstraintValidatorContext context) {
        if (cin == null || cin.trim().isBlank()) {
            
            addConstraintViolation(context, "Le cin est obligatoire", "cin");
            return false;
        }
        return true;
    }

    private boolean validateBonLivraison(String bonLivraison, ConstraintValidatorContext context) {
        if (bonLivraison == null || bonLivraison.trim().isBlank()) {
            addConstraintViolation(context, "Le bon de livraison est obligatoire", "bonLivraison");
            return false;
        }
        return true;
    }

    private boolean validateDateLivraison(LocalDate dateLivraison, ConstraintValidatorContext context) {
        if (dateLivraison == null) {
            addConstraintViolation(context, "La date de livraison est obligatoire", "dateLivraison");
            return false;
        }
        return true;
    }

    private boolean validateDateEcheance(LocalDate dateEcheance, LocalDate dateLivraison,
            ConstraintValidatorContext context) {
        if (dateEcheance == null) {
            addConstraintViolation(context, "La date d'échéance est obligatoire", "dateEcheance");
            return false;
        }
        if (dateLivraison != null && dateEcheance.isBefore(dateLivraison)) {
            addConstraintViolation(context, "La date d'échéance doit être supérieure à la date de livraison",
                    "dateEcheance");
            return false;
        }
        return true;
    }

    private boolean validateBonCommande(String bonCommande, ConstraintValidatorContext context) {
        if (bonCommande == null || bonCommande.trim().isBlank()) {
            addConstraintViolation(context, "Le bon de commande est obligatoire", "bonCommande");
            return false;
        }
        return true;
    }

    private boolean validateDateCommande(LocalDate dateCommande, LocalDate dateEcheance, LocalDate dateLivraison,
            ConstraintValidatorContext context) {
        if (dateCommande == null) {
            addConstraintViolation(context, "La date de commande est obligatoire", "dateCommande");
            return false;
        }
        if (dateEcheance != null && dateCommande.isAfter(dateEcheance)) {
            addConstraintViolation(context, "La date de commande doit être avant la date d'échéance", "dateCommande");
            return false;
        }
        if (dateLivraison != null && dateCommande.isAfter(dateLivraison)) {
            addConstraintViolation(context, "La date de commande doit être avant la date de livraison", "dateCommande");
            return false;
        }
        return true;
    }

    private void addConstraintViolation(ConstraintValidatorContext context, String message, String propertyNode) {
        context.buildConstraintViolationWithTemplate(message)
                .addPropertyNode(propertyNode)
                .addConstraintViolation();
    }
}
