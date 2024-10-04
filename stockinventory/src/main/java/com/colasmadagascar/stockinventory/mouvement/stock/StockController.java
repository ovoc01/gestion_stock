package com.colasmadagascar.stockinventory.mouvement.stock;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("api/v1/stocks")
@RequiredArgsConstructor
public class StockController {
    private final StockService stockService;

    @PostMapping("/valorisations")
    public ResponseEntity<Object> getValorisations(@RequestBody StockRequest request) {
        Map<String,Object> data = new HashMap<>();
        try{
            data = stockService.stockValeur(request.getMagId(), request.getEmplId(), request.getCode());
            return ResponseEntity.ok(data);
        }catch (Exception e){
            data.put("error",e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(data);
        }
    }

    @PostMapping("/valorisations/export")
    public ResponseEntity<Map<String, Object>> exportExcel( @RequestBody StockRequest request) throws Exception {
        ByteArrayInputStream resource = stockService.exportToExcel(request.getMagId(), request.getEmplId(), request.getCode());
        String fileName = String.format("valorisations_%s.xlsx", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss")));

        // Convert the Excel file to Base64 string
        byte[] byteArray = resource.readAllBytes();
        String base64Data = Base64.getEncoder().encodeToString(byteArray);

        // Prepare response map
        Map<String, Object> response = new HashMap<>();
        response.put("filename", fileName);
        response.put("filedata", base64Data);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(response);
    }

}
