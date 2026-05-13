package com.example.demo.service;

import com.example.demo.model.RegistroResiduo;
import com.example.demo.repository.RegistroResiduoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
@RequiredArgsConstructor
public class RegistroResiduoService {
    
    private final RegistroResiduoRepository repository;

    public Page<RegistroResiduo> listarTodos(String termo, Pageable pageable) {
    if (termo != null && !termo.trim().isEmpty()) {
        return repository.buscarPorTermo(termo, pageable);
    }
    return repository.findAll(pageable);
}

    public List<RegistroResiduo> buscarPorEstado(String estado) {
        return repository.findByEstadoIgnoreCase(estado);
    }

    // O retorno em Optional é fundamental para o Controller tratar o Erro 404
    public Optional<RegistroResiduo> buscarPorId(String id) {
        return repository.findById(id);
    }

    public RegistroResiduo salvar(RegistroResiduo registro) {
        return repository.save(registro);
    }

    public boolean deletar(String id) {
        if (!repository.existsById(id)) {
            return false;
        }
        repository.deleteById(id);
        return true;
    }
    // Método para atualizar
    public Optional<RegistroResiduo> atualizar(String id, RegistroResiduo dadosAtualizados) {
        return repository.findById(id).map(registroExistente -> {
            // O MongoDB (presumindo pelo tipo String do ID) substituirá o documento,
            // então precisamos garantir que o ID não seja alterado.
            dadosAtualizados.setId(id);
            return repository.save(dadosAtualizados);
        });
    }
}

