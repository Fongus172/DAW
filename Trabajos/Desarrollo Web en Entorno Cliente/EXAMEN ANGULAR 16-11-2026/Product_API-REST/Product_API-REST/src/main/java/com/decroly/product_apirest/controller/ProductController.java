package com.decroly.product_apirest.controller;

import com.decroly.product_apirest.model.Product;
import com.decroly.product_apirest.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping(value = "/products")
    public ResponseEntity<List<Product>> getProducts() {
        return ResponseEntity.ok().body(this.productService.getAllProducts());
    }


}
