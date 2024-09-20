package com.colasmadagascar.stockinventory.article;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.List;

@RestController
@RequestMapping("api/v1/articles")

public class ArticleController  {
    @Autowired  ArticleService articleService;
    
    @GetMapping
    public ResponseEntity<Object> getAllArticle(@RequestParam(name = "page",required = false,defaultValue = "1") int page,@RequestParam(name = "size",required = false,defaultValue = "5") int size) {
        HashMap<String,Object> data = new HashMap<>();
        try{
            List<ArticleDTO>articles =  articleService.getAllArticleDTO(page,size);
            data.put("articles",articles);
            data.put("totalPages",articleService.count());
            return new ResponseEntity<>(data, HttpStatus.OK);
        }catch(Exception e){
            data.put("error",e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }

    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> findByIdArticle(@PathVariable("id")Long id){
        HashMap<String,Object> data = new HashMap<>();

        try{
            Article article = articleService.getEntityById(id).get();
            data.put("article",article);
            return new ResponseEntity<>(data, HttpStatus.OK);
        }catch(Exception e){
            data.put("error",e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }


    @PostMapping
    public ResponseEntity<Object> createArticle(@Valid  @RequestBody ArticleRequest article){
        HashMap<String,Object> data = new HashMap<>();
        try{
            articleService.saveEntityFromRequest(article);
            data.put("message","Article created successfully");
            return new ResponseEntity<>(data, HttpStatus.CREATED);
        }catch(Exception e){
            data.put("error",e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<Object> updateArticle(@Valid @RequestBody Article article){
        HashMap<String,Object> data = new HashMap<>();

        try{
            articleService.saveEntity(article);
            data.put("message","Article updated successfully");
            return new ResponseEntity<>(data, HttpStatus.CREATED);
        }catch(Exception e){
            data.put("error",e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteArticle(@PathVariable("id")Long id){
        HashMap<String,Object> data = new HashMap<>();
        try{
            articleService.deleteEntityById(id);
            data.put("message","Article deleted successfully");
            return new ResponseEntity<>(data, HttpStatus.OK);
        }catch(Exception e){
            data.put("error",e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    
    }




}