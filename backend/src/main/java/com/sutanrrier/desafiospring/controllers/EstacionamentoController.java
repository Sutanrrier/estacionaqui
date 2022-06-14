package com.sutanrrier.desafiospring.controllers;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sutanrrier.desafiospring.entities.Estacionamento;
import com.sutanrrier.desafiospring.services.EstacionamentoService;

@RestController
@CrossOrigin(origins = "http://127.0.0.1:5500")
@RequestMapping(value = "/estacionamentos")
public class EstacionamentoController {

	@Autowired
	private EstacionamentoService service;

	@GetMapping
	public ResponseEntity<List<Estacionamento>> getAllEstacionamentos() {
		return ResponseEntity.status(HttpStatus.OK).body(service.findAll());
	}

	@GetMapping(value = "/{id}")
	public ResponseEntity<Object> getEstacionamentoById(@PathVariable Integer id) {
		Optional<Estacionamento> estacionamento = service.findById(id);
		if (!estacionamento.isPresent()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Estacionamento não encontrado no banco.");
		}
		return ResponseEntity.status(HttpStatus.OK).body(estacionamento.get());
	}

	@PostMapping
	public ResponseEntity<Estacionamento> saveEstacionamento(@RequestBody Estacionamento obj) {
		obj.setDataCriacao(Date.valueOf(LocalDate.now()));
		return ResponseEntity.status(HttpStatus.CREATED).body(service.save(obj));
	}

	@DeleteMapping(value = "/{id}")
	public ResponseEntity<Object> deleteEstacionamento(@PathVariable Integer id) {
		Optional<Estacionamento> estacionamento = service.findById(id);
		if (!estacionamento.isPresent()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Estacionamento não encontrado no banco.");
		}
		service.delete(estacionamento.get());
		return ResponseEntity.status(HttpStatus.OK).body("Estacionamento Deletado com Sucesso.");
	}

	@PutMapping(value = "/{id}")
	public ResponseEntity<Object> updateEstacionamento(@PathVariable Integer id, @RequestBody Estacionamento obj) {
		Optional<Estacionamento> estacionamento = service.findById(id);
		if (!estacionamento.isPresent() || obj.getId() != id) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Estacionamento não encontrado no banco.");
		}
		obj.setDataCriacao(estacionamento.get().getDataCriacao());
		return ResponseEntity.status(HttpStatus.CREATED).body(service.save(obj));
	}
}
