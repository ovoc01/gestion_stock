package com.colasmadagascar.stockinventory.dataexport.tools;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.BiConsumer;

public class ExcelExportUtility<T> {
    private final Map<Class<?>, BiConsumer<Cell, Object>> cellValueSetters;
    Class<T> type;

    public ExcelExportUtility(Class<T> type) {
        this.type = type;
        cellValueSetters = new HashMap<>();
        initCellValueSetters();
    }

    private void initCellValueSetters() {
        cellValueSetters.put(String.class, (cell, value) -> cell.setCellValue((String) value));
        cellValueSetters.put(Double.class, (cell, value) -> cell.setCellValue((Double) value));
        cellValueSetters.put(Integer.class, (cell, value) -> cell.setCellValue((Integer) value));
        cellValueSetters.put(Long.class, (cell, value) -> cell.setCellValue((Long) value));
        cellValueSetters.put(Boolean.class, (cell, value) -> cell.setCellValue((Boolean) value));
        cellValueSetters.put(Timestamp.class, (cell, value) -> cell.setCellValue(value.toString()));
        cellValueSetters.put(LocalDate.class, (cell, value) -> cell.setCellValue(value.toString()));
        cellValueSetters.put(LocalDateTime.class, (cell, value) -> cell.setCellValue(value.toString()));
    }

    private void setCellValue(Cell cell, Object value) {
        if (value == null) {
            cell.setCellValue("");
            return;
        }

        BiConsumer<Cell, Object> setter = cellValueSetters.get(value.getClass());

        if (setter != null) {
            setter.accept(cell, value);
        } else {
            // Default handling for unsupported types
            cell.setCellValue(value.toString());
        }
    }

    public ByteArrayInputStream exportToExcel(List<T> entities, String[] headers) throws Exception {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Sheet1");
        // Create header row
        Row headerRow = sheet.createRow(0);
        Method[] methods = type.getDeclaredMethods();
        int columnIdx = 0;

        if (headers != null) {
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(columnIdx++);
                cell.setCellValue(headers[i]);
            }
        }


        // Populate rows with entity data
        int rowNum = 1;
        for (T entity : entities) {
            Row row = sheet.createRow(rowNum++);
            for (Method m :methods){
                ExcelRow excelRow = m.getAnnotation(ExcelRow.class);
                if(excelRow!=null){
                    System.out.println(m.getName());
                    m.setAccessible(true);
                    Object value = m.invoke(entity);
                    Cell cell = row.createCell(excelRow.value()-1);
                    setCellValue(cell, value);
                }
            }
        }

        // Write to output stream
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();

        return new ByteArrayInputStream(outputStream.toByteArray());
    }

    private String getFieldDisplayName(Field field) {
        if (field.isAnnotationPresent(Column.class)) {
            return field.getAnnotation(Column.class).name();
        } else if (field.isAnnotationPresent(Id.class)) {
            return "ID";
        } else {
            return field.getName();
        }
    }


}
