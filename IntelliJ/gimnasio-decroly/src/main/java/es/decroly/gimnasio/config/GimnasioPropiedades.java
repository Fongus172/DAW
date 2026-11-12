package es.decroly.gimnasio.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "gimnasio")
public class GimnasioPropiedades {

    private String nombre = "Gimnasio Decroly";
    private int maxPlazas = 30;
}
