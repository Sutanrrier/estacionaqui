package com.sutanrrier.desafiospring.headers;

import org.springframework.http.HttpHeaders;

public class MyHeaders {
	
	public static HttpHeaders getHeaders() {
		HttpHeaders headers = new HttpHeaders();
		headers.set("Access-Control-Allow-Credentials", "true");
		headers.set("Acess-Control-Allow-Methods", "GET,POST,PUT,DELETE");
		return headers;
	}
}