package com.colasmadagascar.stockinventory.dataexport;

import java.io.ByteArrayInputStream;
import java.util.HashMap;
import java.util.Map;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/export")
public class DataServiceController {
    private final DataExportService dataExportService;

    public DataServiceController(DataExportService dataExportService) {
        this.dataExportService = dataExportService;
    }

    // @GetMapping("/export")

    @GetMapping
    public ResponseEntity<Object> export(
            @RequestParam(name = "type") String output,
            @RequestParam(name = "classe") String classe) throws Exception {
        // Constant.ETAT.get(1);

        Map<String, Object> data = dataExportService.export(classe, output);

        return ResponseEntity
                .ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(data);
    }

    /*
     * @GetMapping("/articles-csv")
     * public ResponseEntity<InputStreamResource> exportToCSV() throws Exception {
     * String csvData = dataExportService.exportToCSV();
     * ByteArrayInputStream resource = new ByteArrayInputStream(csvData.getBytes());
     * 
     * return ResponseEntity.ok()
     * .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=data.csv")
     * .contentType(MediaType.parseMediaType("text/csv"))
     * .body(new InputStreamResource(resource));
     * }
     */

    @GetMapping("/articles-pdf")
    public ResponseEntity<InputStreamResource> exportToPDF() throws Exception {
        // String csvData =;
        ByteArrayInputStream resource = dataExportService.generatePdfReport("etat-stock", new HashMap<>() {
            {
                put("title", "ETAT DE MOUVEMENT DE STOCK");
            }
        });

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=data.pdf")
                .contentType(MediaType.parseMediaType("application/pdf"))
                .body(new InputStreamResource(resource));
    }

}
