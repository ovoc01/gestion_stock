package com.colasmadagascar.stockinventory.mouvement.sortie;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import com.colasmadagascar.stockinventory.dataexport.DataExportService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/mouvements/commandes")
public class CommandeController {
    private final CommandeService commandeService;
    private final DataExportService dataExportService;

    @GetMapping
    public ResponseEntity<Object> getAllCommande() {
        Map<String, Object> data = new HashMap<>();
        try {
            data.put("commandes", commandeService.getAllCommande());
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            data.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }

    @GetMapping("/{idCommande}")
    public ResponseEntity<Object> getAllCommandeSortie(@PathVariable("idCommande") Long id) {
        Map<String, Object> data = new HashMap<>();
        try {
            data.put("commande", commandeService.getAllCommandeSortie(id));
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            data.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }

    @PostMapping
    @PreAuthorize("hasAuthority('Administrateur')")
    public ResponseEntity<Object> createCommande(@RequestBody CommandeRequest request) {
        Map<String, Object> data = new HashMap<>();
        try {
            commandeService.createCommande(request.getEmplId(), request.getUnopId());
            data.put("message", "Commande created successfully");
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            data.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }

    @GetMapping("cessions/{idCommande}")
    public ResponseEntity<Object> generateCession(@PathVariable("idCommande") Long id) throws IOException {
        HashMap<String, Object> data = new HashMap<>();
        data.put("cession", commandeService.getCessionById(id));
        data.put("title", "FEUILLE DE CESSION INTERNE");
        ByteArrayInputStream resource = dataExportService.generatePdfReport("cession", data);

        HashMap<String, Object> response = new HashMap<>();

        byte[] byteArray = resource.readAllBytes();
        String base64Data = Base64.getEncoder().encodeToString(byteArray);

        response.put("filename", dataExportService.generateFileName("cession", "pdf"));
        response.put("filedata", base64Data);

        try {
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=data.pdf")

                    .body(response);
        } catch (Exception e) {
            e.printStackTrace();
            data.put("error", e.getLocalizedMessage());
            return ResponseEntity.badRequest()
                    .body(data);
        }

    }

    @GetMapping("etat-stock")
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
