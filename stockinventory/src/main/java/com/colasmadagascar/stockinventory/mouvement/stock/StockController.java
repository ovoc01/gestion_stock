package com.colasmadagascar.stockinventory.mouvement.stock;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
            data.put("valorisation",stockService.stockValeur(request.getMagId(), request.getEmplId(), request.getCode()));
            return ResponseEntity.ok(data);
        }catch (Exception e){
            data.put("error",e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(data);
        }
    }
}
