package com.decroly.product_apirest.services;

import com.decroly.product_apirest.model.Product;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProductService {

    private List<Product> products;

    private void loadProducts(){
        this.products = new ArrayList<>();

        this.products.add(new Product( "Camisa Túnica de Popelín de Manga Larga Athletic",
                "Una prenda básica en el armario, esta camisa clásica de manga larga proporciona un aspecto fácil perfecto para cualquier ocasión",
        19.95,"mujer","http://peticiones.online/images/products/image07.png",
                true));

        this.products.add(new Product("Chaqueta Cortavientos Plegable Mujer",
"Esta chaqueta impermeable es totalmente plegable y cuenta con un bolsillo frontal tipo canguro, encuadernación en el dobladillo y las mangas, y un cordón elástico ajustable en el dobladillo inferior para mantener fuera los elementos",
                27.73,"mujer","http://peticiones.online/images/products/image04.png",
                true));

        this.products.add(new Product("Camisetas Henley de Manga Corta",
                "Esta elegante y cómoda camiseta mantendrá el ritmo de las actividades cotidianas y toda la diversión.",
                18.99,"niño","http://peticiones.online/images/products/image09.png",
                false));

        this.products.add(new Product( "Pantalón chino",
                "Un poco de elástico añade comodidad y flexibilidad a estos clásicos pantalones sueltos caqui.",
                22.98,"hombre","http://peticiones.online/images/products/image11.png",
                true));

        this.products.add(new Product( "Polo de Rendimiento Activo",
                "Tejido elástico, transpirable, que absorbe la humedad y liviano para actividades deportivas",
                33.98,"niño","http://peticiones.online/images/products/image15.png",
                true));

        this.products.add(new Product( "Sudadera Hombre",
                "Esta sudadera con grapas de armario cuenta con una cremallera frontal con bolsillo dividido y puños y dobladillo acanalados con sellado cálido.",
                27.5,"hombre","http://peticiones.online/images/products/image05.png",
                true));

        this.products.add(new Product( "Pantalón de Pierna Ancha con cordón de Mezcla de Lino",
                "Este pantalón moderno cuenta con un tejido favorecedor de la figura para un uso diario versátil.",
                16.6,"mujer","http://peticiones.online/images/products/image14.png",
                true));

        this.products.add(new Product( "Hombre Camisa de franela a cuadros de manga larga",
                "Mismo corte, nuevo nombre: Hemos cambiado el nombre de este estilo de camisa a «Regular Fit» pero las medidas son las mismas.",
                19.4,"hombre","http://peticiones.online/images/products/image08.png",
                true));

        this.products.add(new Product( "Camisetas de Manga Corta Niños, Pack de 5",
                "Tejido de punto ligero, cómodo y suave.",
                13.9,"niño","http://peticiones.online/images/products/image10.png",
                true));

        this.products.add(new Product( "Camiseta sin Mangas",
                "Tejido de punto ligero, cómodo y suave.",
                22.1,"niño","http://peticiones.online/images/products/image16.png",
                false));

        this.products.add(new Product( "Suéter Ligero con Frente Abierto Mujer",
                "Corte estrecho y cómodo que permite el movimiento.",
                18.9,"mujer","http://peticiones.online/images/products/image02.png",
                false));

        this.products.add(new Product( "Hombre Camisetas interiores de cuello a la caja, Pack de 6",
                "Tejido de punto ligero, cómodo y suave. ",
                23.99,"hombre","http://peticiones.online/images/products/image01.png",
                true));

        this.products.add(new Product( "Polo de Golf de Secado rápido de Ajuste Regular Hombre",
                "Este producto talla grande, considera elegir una talla inferior a la usual.",
                10.25,"hombre","http://peticiones.online/images/products/image03.png",
                true));

        this.products.add(new Product( "Saco de Dormir de Microforro Polar Unisex bebé, Pack de 2",
                "Aprovecha los básicos para bebés con estos monos de algodón 100 % suave con un cuello de vuelta y broches en la entrepierna para un fácil vestido y pañales.",
                32.99,"niño","http://peticiones.online/images/products/image06.png",
                false));

        this.products.add(new Product( "Vestido Cruzado con Manga Casquillo",
                "Ajustado en la zona del pecho y la cintura; se ensancha hacia el dobladillo.",
                15.99,"mujer","http://peticiones.online/images/products/image12.png",
                true));

        this.products.add(new Product( "Camisa de Manga Larga de Ajuste clásico",
                "Esta camisa clásica y versátil proporciona un aspecto fácil perfecto para cualquier ocasión.",
                23.79,"mujer","http://peticiones.online/images/products/image17.png",
                true));

        this.products.add(new Product( "Camisa de Senderismo de Manga Corta",
                "Esta camisa clásica y versátil proporciona un aspecto limpio y abotonado, perfecto para cualquier ocasión.",
                20.84,"hombre","http://peticiones.online/images/products/image13.png",
                true));

    }


    public List<Product> getAllProducts() {
        this.loadProducts();
        return products;
    }
}
