package com.colasmadagascar.stockinventory.mouvement.cession;

import lombok.Data;
import java.util.List;

@Data
public class Cession {
    CessionInfoProjection info;
    List<CessionDetails> details;
}