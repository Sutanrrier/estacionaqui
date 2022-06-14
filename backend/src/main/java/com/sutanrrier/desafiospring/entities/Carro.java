package com.sutanrrier.desafiospring.entities;

import java.io.Serializable;
import java.sql.Date;
import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name="tb_carro")
public class Carro implements Serializable{
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer id;
	
	@Column(nullable=false)
	private String cor;
	
	@Column(nullable=false)
	private String placa;
	
	@Column(nullable=false)
	private Double velocidademax;
	
	@Column(nullable=false)
	private Date dataCriacao;
	
	@ManyToOne
	@JoinColumn(name="estacionamento_id")
	private Estacionamento estacionamento;
	
	//Construtores
	public Carro() {
		
	}

	//Getters e Setters
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	
	public String getCor() {
		return cor;
	}
	public void setCor(String cor) {
		this.cor = cor;
	}

	public String getPlaca() {
		return placa;
	}
	public void setPlaca(String placa) {
		this.placa = placa;
	}

	public Double getVelocidademax() {
		return velocidademax;
	}
	public void setVelocidademax(Double velocidademax) {
		this.velocidademax = velocidademax;
	}

	public Date getDataCriacao() {
		return dataCriacao;
	}
	public void setDataCriacao(Date dataCriacao) {
		this.dataCriacao = dataCriacao;
	}

	public Estacionamento getEstacionamento() {
		return estacionamento;
	}
	public void setEstacionamento(Estacionamento estacionamento) {
		this.estacionamento = estacionamento;
	}
	
	//HashCode e equals
	@Override
	public int hashCode() {
		return Objects.hash(id);
	}
	
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Carro other = (Carro) obj;
		return Objects.equals(id, other.id);
	}
	
}
