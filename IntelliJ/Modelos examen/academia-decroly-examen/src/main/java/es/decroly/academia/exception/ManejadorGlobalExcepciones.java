package es.decroly.academia.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

// Este manejador convierte nuestras excepciones en respuestas HTTP claras.
// Así no repetimos try/catch en todos los controladores.
@RestControllerAdvice
public class ManejadorGlobalExcepciones {

    @ExceptionHandler(RecursoNoEncontradoException.class)
    public ProblemDetail manejarNoEncontrado(RecursoNoEncontradoException e) {
        ProblemDetail problema = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);
        problema.setTitle("Recurso no encontrado");
        problema.setDetail(e.getMessage());
        return problema;
    }

    @ExceptionHandler(DatosNoValidosException.class)
    public ProblemDetail manejarDatosNoValidos(DatosNoValidosException e) {
        ProblemDetail problema = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        problema.setTitle("Datos no válidos");
        problema.setDetail(e.getMessage());
        return problema;
    }

    @ExceptionHandler(ConflictoException.class)
    public ProblemDetail manejarConflicto(ConflictoException e) {
        ProblemDetail problema = ProblemDetail.forStatus(HttpStatus.CONFLICT);
        problema.setTitle("Conflicto");
        problema.setDetail(e.getMessage());
        return problema;
    }
}
