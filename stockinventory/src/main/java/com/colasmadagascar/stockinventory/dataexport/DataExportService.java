package com.colasmadagascar.stockinventory.dataexport;


import com.colasmadagascar.stockinventory.article.ArticleDTO;
import com.colasmadagascar.stockinventory.article.ArticleRepository;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class DataExportService {
    private ArticleRepository articleRepository;
    private TemplateEngine templateEngine;

    public DataExportService(ArticleRepository articleRepository,TemplateEngine templateEngine) {
        this.articleRepository = articleRepository;
        this.templateEngine = templateEngine;
    }

    public ByteArrayInputStream exportToExcel() throws Exception {
        String[] columns = {"Article ID","Libelle", "Reference", "Code", "Service","Sous Famille","Unite "};

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Sheet1");

        // Create header row
        Row headerRow = sheet.createRow(0);
        for (int i = 0; i < columns.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(columns[i]);
        }

        // Fetch data and populate rows
        List<ArticleDTO> entities = articleRepository.findAllArticles(); // Or use a custom query
        int rowNum = 1;
        for (ArticleDTO entity : entities) {
            Row row = sheet.createRow(rowNum++);
            // Add data to cells (adjust based on your entity)
            row.createCell(0).setCellValue(entity.getArtId());
            row.createCell(1).setCellValue(entity.getArtLi());
            row.createCell(2).setCellValue(entity.getArtRef());
            row.createCell(3).setCellValue(entity.getArtCd());
            row.createCell(4).setCellValue(entity.getServiceLi());
            row.createCell(5).setCellValue(entity.getSousFamLi());
            row.createCell(6).setCellValue(entity.getUniteLi());

        }

        // Write to output stream
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);

        return new ByteArrayInputStream(outputStream.toByteArray());
    }

    public String exportToCSV() {
        StringBuilder csvData = new StringBuilder();

        csvData.append("Article ID,Libelle, Reference, Code, Service,Sous Famille,Unite\n");


        List<ArticleDTO> entities =articleRepository.findAllArticles(); // Or your custom query
        for (ArticleDTO entity : entities) {
            csvData.append(entity.getArtId()).append(",")
                    .append(entity.getArtLi()).append(",")
                    .append(entity.getArtRef()).append(",")
                    .append(entity.getArtCd()).append(",")
                    .append(entity.getServiceLi()).append(",")
                    .append(entity.getSousFamLi()).append(",")
                    .append(entity.getUniteLi())
                    .append("\n");
        }
        return csvData.toString();
    }

    public ByteArrayInputStream generatePdfReport() {
        // 1. Récupérer les données du référentiel


        // 2. Créer le contexte Thymeleaf
        Context context = new Context();
        context.setVariable("entities", "");

        // 3. Rendre le modèle HTML avec Thymeleaf
        String htmlContent = templateEngine.process("export-template", context);

        // 4. Convertir le HTML en PDF avec Flying Saucer
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(htmlContent);
            renderer.layout();
            renderer.createPDF(outputStream);
            return new ByteArrayInputStream(outputStream.toByteArray());
        } catch (Exception e) {
            // Gérer l'exception
            e.printStackTrace(); // Ou une meilleure journalisation des erreurs
            return null; // Ou lever une exception plus spécifique
        }
    }

}
