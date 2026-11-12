package es.decroly.taller.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

// EJEMPLO EXAMEN - CONFIGURATIONPROPERTIES
// Esta clase lee las propiedades que empiezan por "taller" en application.properties.
// Los valores tienen también un valor por defecto por si alguna propiedad no estuviera escrita.
@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "taller")
public class TallerPropiedades {

    private String nombre = "Taller Decroly";
    private int maxReparacionesActivas = 3;
}
