package es.decroly.biblioteca;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;

@SpringBootApplication
@OpenAPIDefinition(
        info = @Info(
                title = "Biblioteca Decroly API",
                version = "1.0",
                contact = @Contact(
                        name = "Iván Marín"
                )
        )
)
public class BibliotecaDecrolyApplication {

    public static void main(String[] args) {
        SpringApplication.run(BibliotecaDecrolyApplication.class, args);
    }

}
