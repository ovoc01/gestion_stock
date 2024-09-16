package com.colasmadagascar.stockinventory.article;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;


@Service

public class ArticleService  {
   @Autowired
   ArticleRepository articleRepository;

   
   public List<Article> getAllEntities(int page,int size) {
        Pageable pageable = PageRequest.of(page-1, size);
        return articleRepository.findAll(pageable).toList();
    }


    public Optional<Article> getEntityById(Long id) {
        return articleRepository.findById(id);
    }


    public Article saveEntity(Article article) {
        return articleRepository.save(article);
    }


    public Article updateEntity(Article article) {
        return articleRepository.save(article);
    }

    public void deleteEntityById(Long id) {
        articleRepository.deleteById(id);
    }

    public long count(){
        return articleRepository.count();
    }



}