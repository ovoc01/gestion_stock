package com.colasmadagascar.stockinventory.magasin.emplacement;

import com.colasmadagascar.stockinventory.magasin.validator.ValidateEmplacement; 
import lombok.Data;

@Data
@ValidateEmplacement
public class EmplacementRequest {

   String emplLi;

   Long serviceId;

   Long magId;
}
