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

import com.sutanrrier.desafiospring.entities.Carro;
import com.sutanrrier.desafiospring.services.CarroService;

@RestController
@CrossOrigin(origins = "http://127.0.0.1:5500")
@RequestMapping(value = "/carros")
public class CarroController {

	@Autowired
	private CarroService service;

	@GetMapping
	public ResponseEntity<List<Carro>> getAllCarros() {
		return ResponseEntity.status(HttpStatus.OK).body(service.findAll());
	}

	@GetMapping(value = "/{id}")
	public ResponseEntity<Object> getCarroById(@PathVariable Integer id) {
		Optional<Carro> carro = service.findById(id);
		if (!carro.isPresent()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Carro não encontrado no banco de dados!");
		}

		return ResponseEntity.status(HttpStatus.OK).body(carro.get());
	}

	@PostMapping
	public ResponseEntity<Carro> saveCar(@RequestBody Carro obj) {
		obj.setDataCriacao(Date.valueOf(LocalDate.now()));
		return ResponseEntity.status(HttpStatus.CREATED).body(service.save(obj));
	}

	@DeleteMapping(value = "/{id}")
	public ResponseEntity<Object> deleteCar(@PathVariable Integer id) {
		Optional<Carro> carro = service.findById(id);
		if (!carro.isPresent()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Carro não encontrado no banco de dados!");
		}
		service.delete(carro.get());
		return ResponseEntity.status(HttpStatus.OK).body("Carro deletado com sucesso!");
	}

	@PutMapping(value = "/{id}")
	public ResponseEntity<Object> updateCar(@PathVariable Integer id, @RequestBody Carro obj) {
		Optional<Carro> carro = service.findById(id);
		if (!carro.isPresent() || obj.getId() != id) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Carro não encontrado no banco de dados!");
		}
		obj.setDataCriacao(carro.get().getDataCriacao());
		return ResponseEntity.status(HttpStatus.CREATED).body(service.save(obj));
	}
}
