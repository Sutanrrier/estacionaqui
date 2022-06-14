package com.sutanrrier.desafiospring.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sutanrrier.desafiospring.entities.Estacionamento;

@Repository
public interface EstacionamentoRepository extends JpaRepository<Estacionamento, Integer> {

}
