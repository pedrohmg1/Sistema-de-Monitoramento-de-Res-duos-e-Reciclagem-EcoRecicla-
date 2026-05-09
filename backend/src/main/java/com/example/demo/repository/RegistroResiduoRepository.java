package com.example.demo.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.demo.model.RegistroResiduo;
import java.util.List;

public interface RegistroResiduoRepository extends MongoRepository<RegistroResiduo, String> {
    
    // Métodos customizados exigidos pelo projeto
    List<RegistroResiduo> findByEstadoIgnoreCase(String estado);
    List<RegistroResiduo> findByTaxaReciclagemGreaterThan(Double taxa);
}