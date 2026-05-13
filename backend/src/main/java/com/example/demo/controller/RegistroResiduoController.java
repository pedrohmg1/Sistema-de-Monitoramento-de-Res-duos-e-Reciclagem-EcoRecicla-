package com.example.demo.controller;

import com.example.demo.model.RegistroResiduo;
import com.example.demo.service.RegistroResiduoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/residuos")
@RequiredArgsConstructor
public class RegistroResiduoController {

    private final RegistroResiduoService service;

    @GetMapping
    public ResponseEntity<List<RegistroResiduo>> listar() {
        return ResponseEntity.ok(service.listarTodos());
    }

    // Endpoint para o filtro dinâmico no frontend
    @GetMapping("/estado/{uf}")
    public ResponseEntity<List<RegistroResiduo>> buscarPorEstado(@PathVariable String uf) {
        return ResponseEntity.ok(service.buscarPorEstado(uf));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RegistroResiduo> buscarPorId(@PathVariable String id) {
        // Uso do Optional para retornar 200 ou 404 (Tratamento de Erro exigido)
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping
    public ResponseEntity<RegistroResiduo> adicionar(@RequestBody RegistroResiduo registro) {
        RegistroResiduo novoRegistro = service.salvar(registro);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoRegistro);
        // 201
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable String id) {
        boolean deletado = service.deletar(id);
        if (deletado) {
            return ResponseEntity.noContent().build();
            // 204 No Content
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        // 404 Not Found
    }

    @PutMapping("/{id}")
    public ResponseEntity<RegistroResiduo> atualizar(@PathVariable String id, @RequestBody RegistroResiduo registro) {
        return service.atualizar(id, registro)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}