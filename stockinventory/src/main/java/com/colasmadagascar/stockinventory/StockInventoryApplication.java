package com.colasmadagascar.stockinventory;

import com.colasmadagascar.stockinventory.dataexport.DataExportService;

import lombok.RequiredArgsConstructor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import com.colasmadagascar.stockinventory.authentification.AuthenticationService;
import org.springframework.stereotype.Service;


@SpringBootApplication
@Service
@RequiredArgsConstructor
public class StockInventoryApplication {
	
	private final AuthenticationService authService;
	private  final DataExportService dataExportService;


	
	public static void main(String[] args) {

		SpringApplication.run(StockInventoryApplication.class, args);
	}

	
	@EventListener(ApplicationReadyEvent.class)
	public void onApplicationReady() throws Exception {
		//dataExportService.generatePdfReport();
	}
}
