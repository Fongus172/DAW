package es.decroly.gimnasio;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@OpenAPIDefinition(
        info = @Info(
                title = "Gimnasio Decroly API",
                version = "1.0",
                contact = @Contact(
                        name = "Iván Marín"
                )
        )
)
public class GimnasioDecrolyApplication {

    public static void main(String[] args) {
        SpringApplication.run(GimnasioDecrolyApplication.class, args);
    }
}
