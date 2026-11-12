package es.decroly.taller.exception;

public class DatosNoValidosException extends RuntimeException {

    public DatosNoValidosException(String mensaje) {
        super(mensaje);
    }
}
