package com.kolaysoft.ctotracker.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI ctoTrackerOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Haftalik Proje Durum Raporlama ve CTO Takip Sistemi API")
                        .version("1.0.0")
                        .description("Kolaysoft staj projesi. Proje yoneticilerinin haftalik "
                                + "durum raporlarini girdigi, CTO'nun tum proje portfoyunu "
                                + "tek ekrandan izledigi sistemin REST API dokumantasyonu.")
                        .contact(new Contact()
                                .name("Furkan Kilic")
                                .email("furkan.kilic@kolaysoft.com.tr")));
    }
}