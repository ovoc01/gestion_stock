package com.colasmadagascar.stockinventory.dataexport;

import com.colasmadagascar.stockinventory.dataexport.tools.ExcelExportUtility;
import com.colasmadagascar.stockinventory.utils.Utils;
import java.io.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.xhtmlrenderer.pdf.ITextRenderer;


@Service
public class DataExportService {
    // final private ArticleRepository articleRepository;
    final private TemplateEngine templateEngine;
    
    //final private Map<String,Object> map;

    public DataExportService(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
        
    }

    public <T> ByteArrayInputStream exportToExcel(String[] columns, List<?> entities, Class<T> clz) throws Exception {
        ExcelExportUtility<T> excelExportUtility = new ExcelExportUtility<>(clz);
        return excelExportUtility.exportToExcel(entities, columns);
    }

    /*
     * public String exportToCSV() {
     * StringBuilder csvData = new StringBuilder();
     * 
     * csvData.
     * append("Article ID,Libelle, Reference, Code, Service,Sous Famille,Unite\n");
     * 
     * List<ArticleDTO> entities = articleRepository.findAllArticles(); // Or your
     * custom query
     * for (ArticleDTO entity : entities) {
     * csvData.append(entity.getArtId()).append(",")
     * .append(entity.getArtLi()).append(",")
     * .append(entity.getArtRef()).append(",")
     * .append(entity.getArtCd()).append(",")
     * .append(entity.getServiceLi()).append(",")
     * .append(entity.getSousFamLi()).append(",")
     * .append(entity.getUniteLi())
     * .append("\n");
     * }
     * return csvData.toString();
     * }
     */
    public ByteArrayInputStream generatePdfReport(String template, HashMap<String, Object> data) throws IOException {
        // 1. Récupérer les données du référentiel

        // 2. Créer le contexte Thymeleaf
        Context context = new Context();

        String base64 = Utils
                .encodeImageToBase64("/Users/dev/gestion-stock/stockinventory/src/main/resources/static/image.png");
        context.setVariables(data);
        // System.out.println(base64);

        // 3. Rendre le modèle HTML avec Thymeleaf
        String htmlContent = templateEngine.process(template, context);
        String pdfPath = "output.pdf";

        // 4. Convertir le HTML en PDF avec Flying Saucer
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                OutputStream stream = new FileOutputStream(pdfPath);) {

            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(htmlContent);
            renderer.layout();
            renderer.createPDF(outputStream);

            outputStream.writeTo(stream);

            return new ByteArrayInputStream(outputStream.toByteArray());
        } catch (Exception e) {
            // Gérer l'exception
            e.printStackTrace(); // Ou une meilleure journalisation des erreurs
            // return null; // Ou lever une exception plus spécifique
            return null;
        }
    }
    
    
    public String generateFileName(String classeName,String type){
        StringBuilder sb = new StringBuilder();
        sb.append(classeName)
                .append("_")
                .append(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss")))
                .append(ExportType.getFileExtension(type))
                ;
        
        return sb.toString();
    }
    
    public Map<String,Object> export(String classeName,String type){
        return new HashMap<>(){{
        put("fileName",generateFileName(classeName, type));
        }};
    }

}
