/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.colasmadagascar.stockinventory.constant;

import java.util.HashMap;

import org.springframework.http.MediaType;

/**
 * @author dev
 */
public class Export {

    final static HashMap<String, Object> headersInfo = new HashMap<String, Object>() {{
        put("pdf", MediaType.parseMediaType("application/pdf"));
        put("csv", MediaType.parseMediaType("text/csv"));

    }};
}
