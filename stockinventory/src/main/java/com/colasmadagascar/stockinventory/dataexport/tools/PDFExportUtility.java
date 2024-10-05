package com.colasmadagascar.stockinventory.dataexport.tools;

import com.lowagie.text.DocumentException;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;

public class PDFExportUtility   {
    private  TemplateEngine engine;


    public PDFExportUtility(TemplateEngine engine){
        this.engine = engine;
    }

    public ByteArrayInputStream generatePDF(HashMap<String,Object> data,String template) throws IOException, DocumentException {
        Context context = new Context();
        context.setVariables(data);

        String html = engine.process(template,context);
        try(ByteArrayOutputStream stream = new ByteArrayOutputStream()){
            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(html);
            renderer.layout();
            renderer.createPDF(stream);
            return new ByteArrayInputStream(stream.toByteArray());
        }
    }
}
