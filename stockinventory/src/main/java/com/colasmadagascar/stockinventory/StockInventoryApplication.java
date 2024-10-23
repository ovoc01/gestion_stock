package com.colasmadagascar.stockinventory;

import com.colasmadagascar.stockinventory.authentification.AuthenticationService;
import com.colasmadagascar.stockinventory.dataexport.DataExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Service;

@SpringBootApplication
@Service
@RequiredArgsConstructor
@EnableConfigurationProperties
@EnableAutoConfiguration
public class StockInventoryApplication {

	private final AuthenticationService authService;
	private final DataExportService dataExportService;

	
	public static void main(String[] args) {
		// System.out.println(Utils.generateSU("Matière Premières","Ciments","Holcim
		// OONJA"));
		SpringApplication.run(StockInventoryApplication.class, args);
	}

	// @EventListener(ApplicationReadyEvent.class)
	public void onApplicationReady() throws Exception {
		// dataExportService.generatePdfReport(
	}

}
