package com.colasmadagascar.stockinventory.dataexport;


import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayInputStream;
@RestController
@RequestMapping("api/v1/data")
public class DataServiceController {
    private  DataExportService dataExportService;

    public DataServiceController(DataExportService dataExportService) {
        this.dataExportService = dataExportService;
    }



    @GetMapping("/articles-csv")
    public ResponseEntity<InputStreamResource> exportToCSV() throws Exception {
        String csvData = dataExportService.exportToCSV();
        ByteArrayInputStream resource = new ByteArrayInputStream(csvData.getBytes());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=data.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(new InputStreamResource(resource));
    }


    @GetMapping("/articles-pdf")
    public ResponseEntity<InputStreamResource> exportToPDF() throws Exception {
        String csvData = dataExportService.exportToCSV();
        ByteArrayInputStream resource = new ByteArrayInputStream(csvData.getBytes());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=data.pdf")
                .contentType(MediaType.parseMediaType("application/pdf"))
                .body(new InputStreamResource(resource));
    }

}
