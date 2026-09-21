package com.armory.backend;

import com.armory.backend.config.ApyHubConfig;
import com.armory.backend.controller.ImageToPdfController;
import com.armory.backend.exception.GlobalExceptionHandler;
import com.armory.backend.exception.ImageConversionException;
import com.armory.backend.service.ImageToPdfService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class ImageToPdfControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ImageToPdfService service;

    @InjectMocks
    private ImageToPdfController controller;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void testHealthEndpoint() throws Exception {
        mockMvc.perform(get("/api/pdf/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.supportsMultiImage").value(true));
    }

    @Test
    void testConvertSingleImageSuccess() throws Exception {
        byte[] fakePdf = "%PDF-1.4 Mock Single PDF".getBytes();
        when(service.convertToPdf(any(), eq(false))).thenReturn(fakePdf);

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "sample.png",
                "image/png",
                "mock-image-bytes".getBytes()
        );

        mockMvc.perform(multipart("/api/pdf/convert")
                        .file(file)
                        .param("landscape", "false"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_PDF))
                .andExpect(header().string("Content-Disposition", "attachment; filename=\"sample.pdf\""))
                .andExpect(content().bytes(fakePdf));
    }

    @Test
    void testConvertMultipleImagesSuccess() throws Exception {
        byte[] fakePdf = "%PDF-1.4 Mock Combined PDF".getBytes();
        when(service.convertToPdf(any(), eq(false))).thenReturn(fakePdf);

        MockMultipartFile file1 = new MockMultipartFile("files", "page1.jpg", "image/jpeg", "img1".getBytes());
        MockMultipartFile file2 = new MockMultipartFile("files", "page2.png", "image/png", "img2".getBytes());

        mockMvc.perform(multipart("/api/pdf/convert")
                        .file(file1)
                        .file(file2)
                        .param("landscape", "false"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_PDF))
                .andExpect(header().string("Content-Disposition", "attachment; filename=\"student-armory-combined-2-pages.pdf\""))
                .andExpect(content().bytes(fakePdf));
    }

    @Test
    void testServiceValidationEmptyFileList() {
        ApyHubConfig config = new ApyHubConfig();
        ImageToPdfService serviceImpl = new ImageToPdfService(config);

        assertThrows(ImageConversionException.class, () -> serviceImpl.convertToPdf(Collections.emptyList(), false));
    }
}
