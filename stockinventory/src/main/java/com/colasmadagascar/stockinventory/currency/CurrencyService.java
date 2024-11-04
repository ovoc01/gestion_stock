/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.colasmadagascar.stockinventory.currency;

import java.text.NumberFormat;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 *
 * @author dev
 */

@Service
@RequiredArgsConstructor
public class CurrencyService {
    private final NumberFormat currencyFormatter;
    
    public  String formatCurrency (Number amount){
        return currencyFormatter.format(amount);
    }
}
