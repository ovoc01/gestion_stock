package com.colasmadagascar.stockinventory.magasin.emplacement;

import lombok.Data;

@Data
public class EmplacementRequest {
   Long emplId;
   String emplLi;
   Long serviceId;
   Long magId;
}
