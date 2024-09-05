package com.company.colas.invetory.backend.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class WelcomeController {
   @GetMapping("/")
   public String getMethodName() {
      return "Hello world";
   }

}