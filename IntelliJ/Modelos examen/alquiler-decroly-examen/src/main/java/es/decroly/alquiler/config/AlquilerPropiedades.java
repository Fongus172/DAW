package es.decroly.alquiler.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

// EJEMPLO EXAMEN - CONFIGURATIONPROPERTIES
// Esta clase permite leer propiedades que empiezan por "alquiler" desde application.properties.
// Los valores por defecto hacen que la aplicación siga teniendo valores razonables aunque una propiedad falte.
@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "alquiler")
public class AlquilerPropiedades {

    private String nombre = "Alquiler Decroly";
    private int maxDias = 30;
}
