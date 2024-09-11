package com.company.colas.invetory.backend.controller;

import org.springframework.web.bind.annotation.RestController;

import java.sql.Connection;

import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class WelcomeController {

   private static BasicDataSource dataSource = null;
   
   static {
      dataSource = new BasicDataSource();
      dataSource.setUrl("jdbc:postgresql://localhost:5432/db_test");
      dataSource.setUsername("postgres");
      dataSource.setPassword("pixel");

      dataSource.setMinIdle(5);
      dataSource.setMaxIdle(10);
      dataSource.setMaxTotal(25);
   }


   @GetMapping("/")
   public String getIndex() {
      Connection connection  = null;
      try{
         connection = dataSource.getConnection();
         return connection.toString();
      }catch(Exception e){
         return e.getMessage();
      }
   }

   

}