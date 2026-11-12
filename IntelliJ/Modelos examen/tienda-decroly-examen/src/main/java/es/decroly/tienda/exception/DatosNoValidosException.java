package es.decroly.tienda.exception;

public class DatosNoValidosException extends RuntimeException {

    public DatosNoValidosException(String mensaje) {
        super(mensaje);
    }
}
