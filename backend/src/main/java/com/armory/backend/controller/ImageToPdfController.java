package com.armory.backend.controller;

import com.armory.backend.exception.ImageConversionException;
import com.armory.backend.service.ImageToPdfService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
public class ImageToPdfController {

    private final ImageToPdfService service;

    public ImageToPdfController(ImageToPdfService service) {
        this.service = service;
    }

    @PostMapping(
            value = {"/convert", "/api/convert", "/api/pdf/convert"},
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<byte[]> convert(
            @RequestParam(name = "file", required = false) MultipartFile singleFile,
            @RequestParam(name = "files", required = false) List<MultipartFile> multipleFiles,
            @RequestParam(name = "landscape", defaultValue = "false") boolean landscape
    ) throws Exception {

        List<MultipartFile> filesToConvert = new ArrayList<>();
        if (multipleFiles != null && !multipleFiles.isEmpty()) {
            filesToConvert.addAll(multipleFiles.stream().filter(f -> f != null && !f.isEmpty()).toList());
        }
        if (filesToConvert.isEmpty() && singleFile != null && !singleFile.isEmpty()) {
            filesToConvert.add(singleFile);
        }

        if (filesToConvert.isEmpty()) {
            throw new ImageConversionException("Please select at least one valid image file to convert.", HttpStatus.BAD_REQUEST);
        }

        byte[] pdfBytes = service.convertToPdf(filesToConvert, landscape);

        String downloadName = "student-armory-converted.pdf";
        if (filesToConvert.size() == 1) {
            String originalFilename = filesToConvert.get(0).getOriginalFilename();
            if (originalFilename != null && !originalFilename.trim().isEmpty()) {
                int dotIndex = originalFilename.lastIndexOf('.');
                String base = (dotIndex > 0) ? originalFilename.substring(0, dotIndex) : originalFilename;
                downloadName = base + ".pdf";
            }
        } else {
            downloadName = "student-armory-combined-" + filesToConvert.size() + "-pages.pdf";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + downloadName + "\"")
                .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                .body(pdfBytes);
    }

    @GetMapping({"/health", "/api/health", "/api/pdf/health"})
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "Student Armory Image-to-PDF Service",
                "supportsMultiImage", true,
                "message", "Backend is active and ready to convert single and multi-image batches"
        ));
    }
}
