package com.sutanrrier.desafiospring.services;

import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.sutanrrier.desafiospring.entities.Carro;
import com.sutanrrier.desafiospring.repositories.CarroRepository;

@Service
public class CarroService {

	@Autowired
	private CarroRepository repository;
	
	public List<Carro> findAll(){
		return repository.findAll(Sort.by(Sort.Direction.ASC, "id"));
	}
	
	public Optional<Carro> findById(Integer id) {
		return repository.findById(id);
	}
	
	@Transactional
	public Carro save(Carro carro) {
		return repository.save(carro);
	}
	
	@Transactional
	public void delete(Carro carro) {
		repository.delete(carro);
	}
}
