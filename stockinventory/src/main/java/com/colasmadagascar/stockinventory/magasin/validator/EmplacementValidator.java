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
        if (value.getEmplLi() == null || value.getEmplLi().trim().isBlank()) {
            context.buildConstraintViolationWithTemplate("Le libellé de l'article est nécessaire")
                    .addPropertyNode("emplLi")
                    .addConstraintViolation();
            return false;
        }
        Optional<Emplacement> emplacementOptional = emplacementRepository.getEmplacementByEmplLi(value.getEmplLi());
        if(emplacementOptional.isPresent()){
            context.buildConstraintViolationWithTemplate("Libellé déja existant")
                    .addPropertyNode("emplLi")
                    .addConstraintViolation();
            return false;
        }


        if (value.getServiceId() == null) {
            context.buildConstraintViolationWithTemplate("L'emplacement doit être rattaché à un service")
                    .addPropertyNode("serviceId")
                    .addConstraintViolation();
            return false;
        }
        if (value.getMagId() == null) {
            context.buildConstraintViolationWithTemplate("L'emplacement doit être rattaché à un magasin")
                    .addPropertyNode("magId")
                    .addConstraintViolation();
            return false;
        }



        return true;
    }
}
