package com.example;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Component;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.util.stream.Stream;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}

@Entity
class Blog {

    @Id
    @GeneratedValue
    private Long id;
    private String name;

    public Blog() {}

    public Blog (String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "Blog{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }
}

@RepositoryRestResource
interface BlogRepository extends PagingAndSortingRepository<Blog, Long> {
}

@Component
class BlogCommandLineRunner implements CommandLineRunner {
    private BlogRepository repository;

    public BlogCommandLineRunner(BlogRepository repository) {
        this.repository = repository;
    }
    @Override
    public void run(String... strings) throws Exception {
        Stream.of("First", "Second").forEach(b -> repository.save(new Blog(b)));
        repository.findAll().forEach(System.out::println);
    }
}
