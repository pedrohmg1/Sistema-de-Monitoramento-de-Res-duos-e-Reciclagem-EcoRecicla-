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

    public Page<RegistroResiduo> listarTodos(String termo, String estado, Pageable pageable) {
        boolean temTermo = termo != null && !termo.trim().isEmpty();
        boolean temEstado = estado != null && !estado.trim().isEmpty();

        if (temTermo && temEstado) {
            return repository.buscarPorTermoEEstado(termo, estado, pageable);
        } else if (temTermo) {
            return repository.buscarPorTermo(termo, pageable);
        } else if (temEstado) {
            return repository.buscarPorEstadoPaginado(estado, pageable);
        }
        
        return repository.findAll(pageable);
    }

    public List<RegistroResiduo> buscarPorEstado(String estado) {
        return repository.findByEstadoIgnoreCase(estado);
    }

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

    public Optional<RegistroResiduo> atualizar(String id, RegistroResiduo dadosAtualizados) {
        return repository.findById(id).map(registroExistente -> {
            dadosAtualizados.setId(id);
            return repository.save(dadosAtualizados);
        });
    }
}
