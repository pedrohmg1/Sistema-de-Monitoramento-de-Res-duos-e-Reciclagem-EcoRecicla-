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

@RestController
@RequestMapping("/api/residuos")
@RequiredArgsConstructor
public class RegistroResiduoController {

    private final RegistroResiduoService service;

    @GetMapping
    public ResponseEntity<Page<RegistroResiduo>> listar(
        @RequestParam(required = false, defaultValue = "") String termo,
        @RequestParam(required = false, defaultValue = "") String estado, // <-- NOVO PARÂMETRO AQUI
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
    
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(service.listarTodos(termo, estado, pageable)); // <-- PASSAR ESTADO PARA O SERVIÇO
    }

    @GetMapping("/estado/{uf}")
    public ResponseEntity<List<RegistroResiduo>> buscarPorEstado(@PathVariable String uf) {
        return ResponseEntity.ok(service.buscarPorEstado(uf));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RegistroResiduo> buscarPorId(@PathVariable String id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping
    public ResponseEntity<RegistroResiduo> adicionar(@RequestBody RegistroResiduo registro) {
        RegistroResiduo novoRegistro = service.salvar(registro);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoRegistro);
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
    public ResponseEntity<RegistroResiduo> atualizar(@PathVariable String id, @RequestBody RegistroResiduo registro) {
        return service.atualizar(id, registro)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}