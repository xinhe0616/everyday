package com.xinhe;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;

@MapperScan("com.xinhe.dao")
@SpringBootApplication
@EnableScheduling
@EnableCaching
public class NotesApplication extends SpringBootServletInitializer {

    public static void main(String[] args) {
        SpringApplication.run(NotesApplication.class, args);
    }
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(NotesApplication.class);}
}
