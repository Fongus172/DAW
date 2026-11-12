package es.decroly.academia.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

// EJEMPLO EXAMEN - CONFIGURATIONPROPERTIES
// Esta clase permite leer propiedades que empiezan por "academia" desde application.properties.
// Los valores por defecto sirven de respaldo si alguna propiedad no estuviera escrita en el fichero.
@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "academia")
public class AcademiaPropiedades {

    private String nombre = "Academia Decroly";
    private int maxMatriculasActivasAlumno = 5;
}
