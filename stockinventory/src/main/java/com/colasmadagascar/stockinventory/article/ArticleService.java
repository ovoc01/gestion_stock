package com.colasmadagascar.stockinventory.article;

import java.util.List;
import java.util.Optional;

import com.colasmadagascar.stockinventory.article.sousfamille.SousFamille;
import com.colasmadagascar.stockinventory.article.sousfamille.SousFamilleService;
import com.colasmadagascar.stockinventory.utils.Utils;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;


@Service

public class ArticleService  {
   ArticleRepository articleRepository;
   SousFamilleService sousFamilleService;
   public ArticleService(ArticleRepository articleRepository, SousFamilleService sousFamilleService) {
       this.sousFamilleService = sousFamilleService;
       this.articleRepository = articleRepository;
   }

   
   public List<Article> getAllEntities(int page,int size) {
        Pageable pageable = PageRequest.of(page-1, size);
        return articleRepository.findAll(pageable).toList();
    }

    public List<ArticleDTO> getAllArticleDTO(int page,int size) {
        Pageable pageable = PageRequest.of(page-1, size);
        return articleRepository.findAllArticleDTO(pageable).toList();
    }

    @Transactional
    public void saveEntityFromRequest(ArticleRequest articleRequest) {
        SousFamille sousFamille = sousFamilleService.getEntityById(articleRequest.getSousFamId()).get();

       StringBuilder stringBuilder = new StringBuilder();
       stringBuilder
               .append(Utils.createFamilleLogRef(sousFamille.getSousFamLi()))
               .append(Utils.createFamilleLogRef(articleRequest.artLi));


       articleRepository.createArticleFromRequest(
               articleRequest.getArtLi(),
               articleRequest.getArtRef(),
               stringBuilder.toString(),
               sousFamille.getSousFamId(),
               articleRequest.getServiceId(),
               articleRequest.getUniteId()
       );
    }

    @Transactional
    public void updateEntity(ArticleRequest articleRequest){
        SousFamille sousFamille = sousFamilleService.getEntityById(articleRequest.getSousFamId()).get();

        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder
                .append(Utils.createFamilleLogRef(sousFamille.getSousFamLi()))
                .append(Utils.createFamilleLogRef(articleRequest.artLi));

        articleRepository.updateArticleFromRequest(articleRequest.getArtRef(), stringBuilder.toString(), articleRequest.getServiceId(), articleRequest.getSousFamId(), articleRequest.getUniteId(), articleRequest.getArtLi(),articleRequest.getArtId());
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