package es.decroly.tienda.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

// EJEMPLO EXAMEN - CONFIGURATIONPROPERTIES
// Esta clase lee las propiedades que empiezan por "tienda" en application.properties.
// De esta forma evitamos escribir valores de configuración directamente dentro de los controladores.
@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "tienda")
public class TiendaPropiedades {

    private String nombre = "Tienda Decroly";
    private int iva = 21;
    private int maxUnidadesPedido = 10;
}
