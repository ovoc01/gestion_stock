/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.colasmadagascar.stockinventory.constant;

import com.colasmadagascar.stockinventory.dataexport.Exportable;

import java.util.HashMap;
import java.util.Map;

/**
 * @author dev
 */
public class Constant {
    public final static Map<Integer, String> ETAT_LI = new HashMap<>() {
        {
            put(0, "Supprimé");
            put(5, "Active");
        }
    };

    public final static Map<Integer, String> DEMANDE_LI = new HashMap<>() {
        {
            put(0, "Supprimé");
            put(5, "Refusé");
            put(10, "En cours");
            put(15, "Validé");
            put(20, "Livré");
        }
    };

    public final static Map<String, Exportable> EXPORTABLE_MAP = new HashMap<>() {
        {

        }
    };

    public final static Map<Integer, String> MONTH_IN_FRENCH = new HashMap<>() {
        {
            put(1, "Janvier");
            put(2, "Février");
            put(3, "Mars");
            put(4, "Avril");
            put(5, "Mai");
            put(6, "Juin");
            put(7, "Juillet");
            put(8, "Août");
            put(9, "Septembre");
            put(10, "Octobre");
            put(11, "Novembre");
            put(12, "Décembre");
        }
    };

}
