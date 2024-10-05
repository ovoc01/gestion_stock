package com.colasmadagascar.stockinventory.shared;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/test")
public class Controller {
   @GetMapping
   public String index(@RequestParam("fetch")Fetch fetch){
      System.out.println(fetch);
      return "Hello world test";
   }
}
