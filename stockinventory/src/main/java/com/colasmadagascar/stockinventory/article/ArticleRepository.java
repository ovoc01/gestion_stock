package com.colasmadagascar.stockinventory.article;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface ArticleRepository extends JpaRepository<Article,Long> {
    @Query(nativeQuery = true,value = "select * from v_article_lib")
    Page<ArticleDTO> findAllArticleDTO(Pageable pageable);

    @Query(nativeQuery = true,value = "select * from v_article_lib")
    List<ArticleDTO> findAllArticles();

    @Query(nativeQuery = true,value = "insert into article (art_li,art_ref,art_cd,sous_famille_id,service_id,unite_id) values (?1,?2,?3,?4,?5,?6)")
    @Modifying
    void createArticleFromRequest(String artLi, String artRef, String artCd, Long sousFamilleId, Long serviceId, Long uniteId);

    @Query(nativeQuery = true,value = "update article set art_ref=?1 , art_cd=?2 , art_dern_mdf=current_timestamp, service_id=?3, sous_famille_id=?4,unite_id=?5 ,art_li=?6 where art_id=?7")
    @Modifying
    void updateArticleFromRequest(String artRef,String artCd,Long serviceId,Long sousFamilleId,Long uniteId,String artLi,Long artId);
}