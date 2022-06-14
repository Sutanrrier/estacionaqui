package com.sutanrrier.desafiospring.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sutanrrier.desafiospring.entities.Carro;

@Repository
public interface CarroRepository extends JpaRepository<Carro, Integer> {

}
