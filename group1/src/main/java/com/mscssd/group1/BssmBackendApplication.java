package com.mscssd.group1;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class BssmBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BssmBackendApplication.class, args);
	}

}
