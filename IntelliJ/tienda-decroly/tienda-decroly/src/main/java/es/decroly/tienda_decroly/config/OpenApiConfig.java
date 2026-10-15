package es.decroly.tienda_decroly.config;

import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(info = @Info(
        title = "API de la Tienda Decroly",
        version = "1.0",
        description = "Catalogo de produtos y familias de la tienda"))

public class OpenApiConfig {
}
