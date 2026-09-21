package com.armory.backend.service;

import com.armory.backend.config.ApyHubConfig;
import com.armory.backend.exception.ImageConversionException;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

@Service
public class ImageToPdfService {

    private final ApyHubConfig config;
    private final RestClient restClient;

    private static final List<String> SUPPORTED_EXTENSIONS = Arrays.asList(
            "png", "jpeg", "jpg", "gif", "svg", "tif", "tiff", "bmp", "webp"
    );

    public ImageToPdfService(ApyHubConfig config) {
        this.config = config;
        this.restClient = RestClient.builder()
                .baseUrl(config.getBaseUrl())
                .build();
    }

    /**
     * Converts single or multiple uploaded images into a single PDF document.
     */
    public byte[] convertToPdf(List<MultipartFile> files, boolean landscape) throws Exception {
        if (files == null || files.isEmpty()) {
            throw new ImageConversionException("Please select at least one image file to convert.", HttpStatus.BAD_REQUEST);
        }

        for (MultipartFile file : files) {
            validateFile(file);
        }

        // If single image and ApyHub token is configured, try ApyHub first, with local fallback
        if (files.size() == 1) {
            MultipartFile file = files.get(0);
            String token = config.getToken();
            if (token != null && !token.trim().isEmpty() && !token.equals("80ba6840")) {
                try {
                    return convertSingleWithApyHub(file, landscape, token);
                } catch (Exception e) {
                    // Fall back to robust internal PDF engine if ApyHub fails or is rate-limited
                    return convertMultipleLocally(files, landscape);
                }
            }
        }

        // Multi-image conversion (or local conversion)
        return convertMultipleLocally(files, landscape);
    }

    private byte[] convertSingleWithApyHub(MultipartFile file, boolean landscape, String token) throws Exception {
        String originalFilename = file.getOriginalFilename();
        String outputFilename = "converted.pdf";
        if (originalFilename != null && !originalFilename.trim().isEmpty()) {
            int dotIndex = originalFilename.lastIndexOf('.');
            String base = (dotIndex > 0) ? originalFilename.substring(0, dotIndex) : originalFilename;
            outputFilename = base + ".pdf";
        }

        final String finalOutputFilename = outputFilename;
        ByteArrayResource resource = new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return originalFilename != null ? originalFilename : "image.png";
            }
        };

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", resource);

        return restClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/apyhub/convert-image-to-pdf/file/download")
                        .queryParam("output", finalOutputFilename)
                        .queryParam("landscape", landscape)
                        .build())
                .header("apy-token", token)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(body)
                .retrieve()
                .body(byte[].class);
    }

    private byte[] convertMultipleLocally(List<MultipartFile> files, boolean landscape) throws Exception {
        try (PDDocument doc = new PDDocument()) {
            for (MultipartFile file : files) {
                byte[] imageBytes = file.getBytes();
                if (imageBytes.length == 0) continue;

                PDRectangle pageSize = landscape
                        ? new PDRectangle(PDRectangle.A4.getHeight(), PDRectangle.A4.getWidth())
                        : PDRectangle.A4;

                PDPage page = new PDPage(pageSize);
                doc.addPage(page);

                PDImageXObject pdImage = PDImageXObject.createFromByteArray(doc, imageBytes, file.getOriginalFilename());

                float pageWidth = page.getMediaBox().getWidth();
                float pageHeight = page.getMediaBox().getHeight();

                float margin = 20f;
                float maxWidth = pageWidth - (2 * margin);
                float maxHeight = pageHeight - (2 * margin);

                float imgWidth = pdImage.getWidth();
                float imgHeight = pdImage.getHeight();

                float scale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
                float drawWidth = imgWidth * scale;
                float drawHeight = imgHeight * scale;

                float startX = (pageWidth - drawWidth) / 2f;
                float startY = (pageHeight - drawHeight) / 2f;

                try (PDPageContentStream contentStream = new PDPageContentStream(doc, page)) {
                    contentStream.drawImage(pdImage, startX, startY, drawWidth, drawHeight);
                }
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            doc.save(baos);
            return baos.toByteArray();
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ImageConversionException("One or more selected files are empty. Please upload valid image files.", HttpStatus.BAD_REQUEST);
        }

        if (file.getSize() > 100 * 1024 * 1024) {
            throw new ImageConversionException("Image file size exceeds maximum limit of 100MB.", HttpStatus.PAYLOAD_TOO_LARGE);
        }

        String filename = file.getOriginalFilename();
        if (filename != null && filename.contains(".")) {
            String ext = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase(Locale.ROOT);
            if (!SUPPORTED_EXTENSIONS.contains(ext)) {
                throw new ImageConversionException(
                        "Unsupported image format in file '" + filename + "'. Supported formats are PNG, JPEG, JPG, GIF, SVG, TIFF, BMP, WEBP.",
                        HttpStatus.BAD_REQUEST
                );
            }
        }
    }
}
