package com.colasmadagascar.stockinventory;

import com.colasmadagascar.stockinventory.dataexport.DataExportService;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Component;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import com.colasmadagascar.stockinventory.authentification.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.FileOutputStream;
import java.io.OutputStream;

@SpringBootApplication
@Service
public class StockInventoryApplication {
	
	private final AuthenticationService authService;
	private  final DataExportService dataExportService;

	public StockInventoryApplication(AuthenticationService authService, DataExportService dataExportService) {
		this.authService = authService;
        this.dataExportService = dataExportService;
    }
	
	public static void main(String[] args) {

		SpringApplication.run(StockInventoryApplication.class, args);
	}

	
	@EventListener(ApplicationReadyEvent.class)
	public void onApplicationReady() throws Exception {
		//dataExportService.generatePdfReport();
	}
}
