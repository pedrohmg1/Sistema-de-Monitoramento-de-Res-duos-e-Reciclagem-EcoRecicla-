package com.example.demo.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.demo.model.RegistroResiduo;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Query;

public interface RegistroResiduoRepository extends MongoRepository<RegistroResiduo, String> {
    
    // Métodos customizados exigidos pelo projeto
    List<RegistroResiduo> findByEstadoIgnoreCase(String estado);
    @Query("{ '$or': [ { 'municipio': { $regex: ?0, $options: 'i' } }, { 'estado': { $regex: ?0, $options: 'i' } } ] }")
    Page<RegistroResiduo> buscarPorTermo(String termo, Pageable pageable);
}