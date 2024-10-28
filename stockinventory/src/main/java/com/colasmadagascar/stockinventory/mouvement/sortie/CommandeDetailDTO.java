package com.colasmadagascar.stockinventory.mouvement.sortie;

import com.colasmadagascar.stockinventory.mouvement.MouvementDTO;
import java.util.List;
import lombok.Data;

@Data
public class CommandeDetailDTO {
    CommandeDTO info;
    List<MouvementDTO> details;
    String montantTotal;
}
