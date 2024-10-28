package com.colasmadagascar.stockinventory.article;

import com.colasmadagascar.stockinventory.dataexport.DataExportService;
import com.colasmadagascar.stockinventory.shared.Fetch;
import jakarta.validation.Valid;

import java.io.ByteArrayInputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/articles")
@RequiredArgsConstructor
public class ArticleController {
    final ArticleService articleService;
    private final DataExportService dataExportService;

    @GetMapping
    public ResponseEntity<Object> getAllArticles(
            @RequestParam(name = "page", required = false, defaultValue = "1") int page,
            @RequestParam(name = "size", required = false, defaultValue = "5") int size,
            @RequestParam(name = "fetch", defaultValue = "PAGINATION") Fetch fetch) {
        HashMap<String, Object> data = new HashMap<>();
        try {
            List<ArticleDTO> articles = articleService.getAllArticleDTO(page, size, fetch);
            data.put("articles", articles);
            data.put("totalPages", articleService.count());
            return new ResponseEntity<>(data, HttpStatus.OK);
        } catch (Exception e) {
            data.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }

    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> findByIdArticle(@PathVariable("id") Long id) {
        HashMap<String, Object> data = new HashMap<>();

        try {
            Article article = articleService.getEntityById(id).get();
            data.put("article", article);
            return new ResponseEntity<>(data, HttpStatus.OK);
        } catch (Exception e) {
            data.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }

    @GetMapping("/export")
    public ResponseEntity<Map<String, Object>> exportExcel() throws Exception {
        ByteArrayInputStream resource = articleService.exportToExcel();
        String fileName = String.format("articles_%s.xlsx", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss")));

        // Convert the Excel file to Base64 string
        byte[] byteArray = resource.readAllBytes();
        String base64Data = Base64.getEncoder().encodeToString(byteArray);

        // Prepare response map
        Map<String, Object> response = new HashMap<>();
        response.put("filename", fileName);
        response.put("filedata", base64Data);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(response);
    }


    @PostMapping
    public ResponseEntity<Object> createArticle(@Valid @RequestBody ArticleRequest article) {
        HashMap<String, Object> data = new HashMap<>();
        try {
            articleService.saveEntityFromRequest(article);
            data.put("message", "Article created successfully");
            return new ResponseEntity<>(data, HttpStatus.CREATED);
        } catch (Exception e) {
            data.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<Object> updateArticle(@Valid @RequestBody Article article) {
        HashMap<String, Object> data = new HashMap<>();

        try {
            articleService.saveEntity(article);
            data.put("message", "Article updated successfully");
            return new ResponseEntity<>(data, HttpStatus.CREATED);
        } catch (Exception e) {
            data.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteArticle(@PathVariable("id") Long id) {
        HashMap<String, Object> data = new HashMap<>();
        try {
            articleService.deleteEntityById(id);
            data.put("message", "Article deleted successfully");
            return new ResponseEntity<>(data, HttpStatus.OK);
        } catch (Exception e) {
            data.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(data);
        }

    }


}