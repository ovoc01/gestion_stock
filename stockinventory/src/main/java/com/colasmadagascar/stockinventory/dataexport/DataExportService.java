package com.colasmadagascar.stockinventory.dataexport;

import com.colasmadagascar.stockinventory.article.ArticleDTO;
import com.colasmadagascar.stockinventory.article.ArticleRepository;
import com.colasmadagascar.stockinventory.dataexport.tools.ExcelExportUtility;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.FileSystems;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.xhtmlrenderer.pdf.ITextRenderer;

@Service
@RequiredArgsConstructor
public class DataExportService {
    final private ArticleRepository articleRepository;
    final private TemplateEngine templateEngine;
    // final private Map<String,Object> map;
    final Logger logger = LoggerFactory.getLogger(getClass());

    public <T> ByteArrayInputStream exportToExcel(String[] columns, List<?> entities, Class<T> clz) throws Exception {
        ExcelExportUtility<T> excelExportUtility = new ExcelExportUtility<>(clz);
        return excelExportUtility.exportToExcel(entities, columns);
    }

    public String exportToCSV() {
        StringBuilder csvData = new StringBuilder();

        csvData.append("Article ID,Libelle, Reference, Code, Service,Sous Famille,Unite\n");

        List<ArticleDTO> entities = articleRepository.findAllArticlesDTO(); // Or your

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

    public ByteArrayInputStream generatePdfReport(String template, HashMap<String, Object> data) throws IOException {
        // 1. Récupérer les données du référentiel

        // 2. Créer le contexte Thymeleaf
        Context context = new Context();

        String htmlContent = templateEngine.process("export-template", context);

        // htmlContent = htmlContent.replace("${imageUrl}", base64);
        String pdfPath = "output.pdf";
        // System.out.println(htmlContent);
        String baseUrl = FileSystems.getDefault()
                .getPath("src", "main", "resources", "templates")
                .toUri()
                .toURL()
                .toString();

        // 4. Convertir le HTML en PDF avec Flying Saucer
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                OutputStream stream = new FileOutputStream(pdfPath);) {

            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(htmlContent, baseUrl);
            renderer.layout();

            renderer.createPDF(outputStream, true);
            renderer.finishPDF();

            outputStream.writeTo(stream);

            return new ByteArrayInputStream(outputStream.toByteArray());
        } catch (Exception e) {
            // Gérer l'exception
            logger.error("Une erreur c'est produite", e);
            // e.printStackTrace(); // Ou une meilleure journalisation des erreurs
            // return null; // Ou lever une exception plus spécifique
            return null;
        }
    }

    public String generateFileName(String classeName, String type) {
        StringBuilder sb = new StringBuilder();
        sb.append(classeName)
                .append("_")
                .append(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss")))
                .append(ExportType.getFileExtension(type));

        return sb.toString();
    }

    public Map<String, Object> export(String classeName, String type) {
        return new HashMap<>() {
            {
                put("fileName", generateFileName(classeName, type));
            }
        };
    }

}
