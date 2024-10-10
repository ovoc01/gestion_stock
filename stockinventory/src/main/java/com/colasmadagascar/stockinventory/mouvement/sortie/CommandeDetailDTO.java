package com.colasmadagascar.stockinventory.mouvement.sortie;

import com.colasmadagascar.stockinventory.mouvement.MouvementDTO;
import lombok.Data;

import java.util.List;

@Data
public class CommandeDetailDTO {
    CommandeDTO info;
    List<MouvementDTO> details;
}
