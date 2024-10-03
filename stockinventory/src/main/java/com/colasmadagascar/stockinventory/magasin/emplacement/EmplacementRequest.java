package com.colasmadagascar.stockinventory.magasin.emplacement;

import com.colasmadagascar.stockinventory.magasin.validator.ValidateEmplacement;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@ValidateEmplacement
public class EmplacementRequest {

   String emplLi;

   Long serviceId;

   Long magId;
}
