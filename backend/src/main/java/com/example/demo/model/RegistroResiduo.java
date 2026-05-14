package com.example.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "registros")
public class RegistroResiduo {
    
    @Id
    private String id;
    private String municipio;
    private String estado;
    private String residuos_total; // em toneladas
    private String residuos_domiciliares_e_publicos;   // percentual
    private Integer ano;
}