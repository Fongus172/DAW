package es.decroly.taller;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@OpenAPIDefinition(
        info = @Info(
                title = "Taller Decroly API",
                version = "1.0",
                contact = @Contact(name = "Iván Marín")
        )
)
public class TallerDecrolyApplication {

    public static void main(String[] args) {
        SpringApplication.run(TallerDecrolyApplication.class, args);
    }
}
