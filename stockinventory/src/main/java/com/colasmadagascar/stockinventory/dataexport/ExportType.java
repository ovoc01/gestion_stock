/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.colasmadagascar.stockinventory.dataexport;

import lombok.Data;

/**
 *
 * @author dev
 */
@Data
public class ExportType {
    
    /**
     * 
     */
    public static String getFileExtension(String type){
        switch(type.toLowerCase()){
            case "pdf":
                return ".pdf";
            case "csv":
                return ".csv";
            case "excel":
                return "xlsx";
            default:
                    throw new IllegalArgumentException(String.format("Extension not found for %",type));
                       
        }
    }
}
