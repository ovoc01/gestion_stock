package com.colasmadagascar.stockinventory;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Component;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import com.colasmadagascar.stockinventory.authentification.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@SpringBootApplication
@Service
public class StockInventoryApplication {
	
	private final AuthenticationService authService;

	public StockInventoryApplication(AuthenticationService authService) {
		this.authService = authService;
	}
	
	public static void main(String[] args) {
		SpringApplication.run(StockInventoryApplication.class, args);
	}

	
	//@EventListener(ApplicationReadyEvent.class)
	public void onApplicationReady() {
		authService.createUserData();
	}
}
