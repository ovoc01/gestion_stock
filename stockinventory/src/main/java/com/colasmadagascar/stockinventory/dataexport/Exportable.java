package com.colasmadagascar.stockinventory.dataexport;

import lombok.Data;

import java.lang.reflect.Method;

@Data
public class Exportable {
    String[] columns;
    Method dataRetriever;
    Class<?> dataClass;
}