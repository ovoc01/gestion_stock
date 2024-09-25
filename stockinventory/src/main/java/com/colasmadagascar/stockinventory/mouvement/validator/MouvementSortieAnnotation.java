package com.colasmadagascar.stockinventory.mouvement.validator;


import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.TYPE, ElementType.ANNOTATION_TYPE}) // Apply to class or another annotation
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = MouvementStockValidator.class)
public @interface MouvementSortieAnnotation {
    String message() default "Quantite insuffisante";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
