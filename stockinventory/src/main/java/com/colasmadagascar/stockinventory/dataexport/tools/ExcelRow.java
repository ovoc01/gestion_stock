package com.colasmadagascar.stockinventory.dataexport.tools;

import com.colasmadagascar.stockinventory.mouvement.validator.MouvementStockValidator;
import jakarta.validation.Constraint;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.METHOD}) // Apply to class or another annotation
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = MouvementStockValidator.class)
public @interface ExcelRow {
    int value();
}
