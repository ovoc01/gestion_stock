package com.colasmadagascar.stockinventory.livraison.validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ ElementType.TYPE, ElementType.ANNOTATION_TYPE }) // Apply to class or another annotation
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy =LivraisonValidation.class)
public @interface ValidateLivraison {
    String message() default "Erreur lors de la création de la validation";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
    boolean isUpdate() default false;
}
