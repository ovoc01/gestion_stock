package com.colasmadagascar.stockinventory.mouvement.stock;

import com.colasmadagascar.stockinventory.dataexport.DataExportService;
import com.colasmadagascar.stockinventory.mouvement.MouvementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StockService {
    private final MouvementRepository mouvementRepository;
    private final DataExportService dataExportService;

    public Map<String,Object> stockValeur (Long magId, Long emplId, String code){
        Map<String,Object> data = new HashMap<>();
        double val = mouvementRepository.getValorisation(magId,emplId,code);
        data.put("valorisation",val);
        data.put("details",mouvementRepository.getValorisationDetails(magId,emplId,code));
        return data;
    }

    public ByteArrayInputStream exportToExcel(Long magId, Long emplId, String code) throws Exception {
        String[] columns = {"Reference","Article", "Famille", "Magasin", "Emplacement","Quantite","CMUP "};
        List<StockDetailProjection> entities = mouvementRepository.getValorisationDetails(magId,emplId, code); // Or use a custom query
        return dataExportService.exportToExcel(columns,entities, StockDetailProjection.class);
    }

    public ByteArrayInputStream exportPdf(Long magId, Long emplId, String code) throws IOException {
        List<StockDetailProjection> entities = mouvementRepository.getValorisationDetails(magId,emplId, code); // Or use a custom query
        HashMap<String,Object> data = new HashMap<>();
        data.put("valorisations",entities);
        return dataExportService.generatePdfReport("valorisation",data);
    }
}
