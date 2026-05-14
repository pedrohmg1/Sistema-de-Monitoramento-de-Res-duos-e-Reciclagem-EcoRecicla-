package com.example.demo.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.demo.model.RegistroResiduo;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Query;

public interface RegistroResiduoRepository extends MongoRepository<RegistroResiduo, String> {
    
    List<RegistroResiduo> findByEstadoIgnoreCase(String estado);
    
    @Query("{ '$or': [ { 'municipio': { $regex: ?0, $options: 'i' } }, { 'estado': { $regex: ?0, $options: 'i' } } ] }")
    Page<RegistroResiduo> buscarPorTermo(String termo, Pageable pageable);

    // <-- NOVOS MÉTODOS PARA O FILTRO
    @Query("{ 'estado': { $regex: ?0, $options: 'i' } }")
    Page<RegistroResiduo> buscarPorEstadoPaginado(String estado, Pageable pageable);

    @Query("{ 'municipio': { $regex: ?0, $options: 'i' }, 'estado': { $regex: ?1, $options: 'i' } }")
    Page<RegistroResiduo> buscarPorTermoEEstado(String termo, String estado, Pageable pageable);
}