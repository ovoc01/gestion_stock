package com.colasmadagascar.stockinventory.magasin.validator;

import com.colasmadagascar.stockinventory.magasin.emplacement.Emplacement;
import com.colasmadagascar.stockinventory.magasin.emplacement.EmplacementRepository;
import com.colasmadagascar.stockinventory.magasin.emplacement.EmplacementRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class EmplacementValidator implements ConstraintValidator<ValidateEmplacement, EmplacementRequest> {
    private final EmplacementRepository emplacementRepository;

    @Override
    public boolean isValid(EmplacementRequest value, ConstraintValidatorContext context) {
        context.disableDefaultConstraintViolation();
        boolean isValid = true;

        isValid &= validateEmplLi(value.getEmplLi(), context);
        isValid &= validateUniqueEmplLi(value.getEmplLi(), context);
        isValid &= validateServiceId(value.getServiceId(), context);
        isValid &= validateMagId(value.getMagId(), context);

        return isValid;
    }

    private boolean validateEmplLi(String emplLi, ConstraintValidatorContext context) {
        if (emplLi == null || emplLi.trim().isBlank()) {
            addConstraintViolation(context, "Le libellé de l'article est nécessaire", "emplLi");
            return false;
        }
        return true;
    }

    private boolean validateUniqueEmplLi(String emplLi, ConstraintValidatorContext context) {
        if (emplLi != null) {
            Optional<Emplacement> emplacementOptional = emplacementRepository.getEmplacementByEmplLi(emplLi);
            if (emplacementOptional.isPresent()) {
                addConstraintViolation(context, "Libellé déjà existant", "emplLi");
                return false;
            }
        }
        return true;
    }

    private boolean validateServiceId(Long serviceId, ConstraintValidatorContext context) {
        if (serviceId == null) {
            addConstraintViolation(context, "L'emplacement doit être rattaché à un service", "serviceId");
            return false;
        }
        return true;
    }

    private boolean validateMagId(Long magId, ConstraintValidatorContext context) {
        if (magId == null) {
            addConstraintViolation(context, "L'emplacement doit être rattaché à un magasin", "magId");
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
