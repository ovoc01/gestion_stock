package com.colasmadagascar.stockinventory.article;

import java.io.ByteArrayInputStream;
import java.util.List;
import java.util.Optional;

import com.colasmadagascar.stockinventory.article.sousfamille.SousFamille;
import com.colasmadagascar.stockinventory.article.sousfamille.SousFamilleDTO;
import com.colasmadagascar.stockinventory.article.sousfamille.SousFamilleRepository;
import com.colasmadagascar.stockinventory.article.sousfamille.SousFamilleService;
import com.colasmadagascar.stockinventory.dataexport.DataExportService;
import com.colasmadagascar.stockinventory.serviceexp.ServiceExploitant;
import com.colasmadagascar.stockinventory.serviceexp.ServiceExploitantRepository;
import com.colasmadagascar.stockinventory.shared.Fetch;

import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;

import static com.colasmadagascar.stockinventory.utils.Utils.generateSKU;

@Service

public class ArticleService {
    private final SousFamilleRepository sousFamilleRepository;
    ArticleRepository articleRepository;
    SousFamilleService sousFamilleService;
    final ServiceExploitantRepository serviceExploitantRepository;
    final DataExportService dataExportService;

    public ArticleService(ArticleRepository articleRepository, SousFamilleService sousFamilleService, SousFamilleRepository sousFamilleRepository, ServiceExploitantRepository serviceExploitantRepository, DataExportService dataExportService) {
        this.sousFamilleService = sousFamilleService;
        this.articleRepository = articleRepository;
        this.sousFamilleRepository = sousFamilleRepository;
        this.serviceExploitantRepository = serviceExploitantRepository;
        this.dataExportService = dataExportService;
    }


    public List<Article> getAllEntities(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        return articleRepository.findAll(pageable).toList();
    }

    public List<ArticleDTO> getAllArticleDTO(int page, int size, Fetch fetch) {
        if (fetch == Fetch.ALL) return articleRepository.findAllArticlesDTO();
        Pageable pageable = PageRequest.of(page - 1, size);
        return articleRepository.findAllArticlesDTO(pageable).toList();
    }

    @Transactional
    public void saveEntityFromRequest(ArticleRequest articleRequest) {
        SousFamilleDTO sousFamilleDTO = sousFamilleRepository.findSousFamilleBySousFamId(articleRequest.getSousFamId()).get();
        ServiceExploitant serviceExploitant = serviceExploitantRepository.findById(articleRequest.getServiceId()).get();
        String sku = generateSKU(articleRequest.getArtLi(), sousFamilleDTO.getFamilleLi(), sousFamilleDTO.getSousFamLi(), serviceExploitant.getServiceLi());

        articleRepository.createArticleFromRequest(
                articleRequest.getArtLi(),
                articleRequest.getArtRef(),
                sku,
                sousFamilleDTO.getSousFamId(),
                articleRequest.getServiceId(),
                articleRequest.getUniteId()
        );
    }

    @Transactional
    public void updateEntity(ArticleRequest articleRequest) {
        SousFamille sousFamille = sousFamilleService.getEntityById(articleRequest.getSousFamId()).get();

        StringBuilder stringBuilder = new StringBuilder();

        articleRepository.updateArticleFromRequest(articleRequest.getArtRef(), stringBuilder.toString(), articleRequest.getServiceId(), articleRequest.getSousFamId(), articleRequest.getUniteId(), articleRequest.getArtLi(), articleRequest.getArtId());
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

    public long count() {
        return articleRepository.count();
    }


    public ByteArrayInputStream exportToExcel() throws Exception {
        String[] columns = {"Article ID", "Libelle", "Reference", "Code", "Service", "Sous Famille", "Unite "};
        List<ArticleDTO> entities = articleRepository.findAllArticlesDTO(); // Or use a custom query
        return dataExportService.exportToExcel(columns, entities, ArticleDTO.class);
    }
}