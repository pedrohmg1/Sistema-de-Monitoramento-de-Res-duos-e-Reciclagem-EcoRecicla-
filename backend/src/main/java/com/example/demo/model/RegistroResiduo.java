package com.example.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "testes")
public class RegistroResiduo {
    
    @Id
    private String id;
    private String municipio;
    private String estado;
    private Double quantidadeGerada; // em toneladas
    private Double taxaReciclagem;   // percentual
    private Integer ano;
}