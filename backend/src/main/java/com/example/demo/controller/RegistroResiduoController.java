package com.example.demo.controller;

import com.example.demo.model.RegistroResiduo;
import com.example.demo.service.RegistroResiduoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import java.util.Map;


@RestController
@RequestMapping("/api/residuos")
@RequiredArgsConstructor
public class RegistroResiduoController {

    private final RegistroResiduoService service;

    @GetMapping
    public ResponseEntity<?> listar(
        @RequestParam(required = false, defaultValue = "") String termo,
        @RequestParam(required = false, defaultValue = "") String estado,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
    
        if (page < 0) return ResponseEntity.badRequest().body(Map.of("mensagem", "O parâmetro 'page' não pode ser negativo."));
        if (size <= 0) return ResponseEntity.badRequest().body(Map.of("mensagem", "O parâmetro 'size' deve ser maior que zero."));
    
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(service.listarTodos(termo, estado, pageable));
    }

    @GetMapping("/estado/{uf}")
    public ResponseEntity<List<RegistroResiduo>> buscarPorEstado(@PathVariable String uf) {
        List<RegistroResiduo> resultado = service.buscarPorEstado(uf);
        if (resultado.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(resultado);
}

    @GetMapping("/{id}")
    public ResponseEntity<RegistroResiduo> buscarPorId(@PathVariable String id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping
    public ResponseEntity<?> adicionar(@RequestBody RegistroResiduo registro) {
        String erro = validar(registro);
        if (erro != null) return ResponseEntity.badRequest().body(Map.of("mensagem", erro));
        return ResponseEntity.status(HttpStatus.CREATED).body(service.salvar(registro));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable String id) {
        boolean deletado = service.deletar(id);
        if (deletado) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable String id, @RequestBody RegistroResiduo registro) {
        String erro = validar(registro);
        if (erro != null) return ResponseEntity.badRequest().body(Map.of("mensagem", erro));
        return service.atualizar(id, registro)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    private String validar(RegistroResiduo r) {
        if (r.getMunicipio() == null || r.getMunicipio().isBlank()) return "Campo 'municipio' é obrigatório.";
        if (r.getEstado() == null || r.getEstado().isBlank()) return "Campo 'estado' é obrigatório.";
        if (r.getAno() == null) return "Campo 'ano' é obrigatório.";
        return null;
    }
}