package org.jhipster.web.rest;

import com.codahale.metrics.annotation.Timed;
import org.jhipster.domain.Blog;
import org.jhipster.repository.BlogRepository;
import org.jhipster.repository.search.BlogSearchRepository;
import org.jhipster.web.rest.util.HeaderUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

/**
 * REST controller for managing Blog.
 */
@RestController
@RequestMapping("/api")
public class BlogResource {

    private final Logger log = LoggerFactory.getLogger(BlogResource.class);

    @Inject
    private BlogRepository blogRepository;

    @Inject
    private BlogSearchRepository blogSearchRepository;

    /**
     * POST  /blogs : Create a new blog.
     *
     * @param blog the blog to create
     * @return the ResponseEntity with status 201 (Created) and with body the new blog, or with status 400 (Bad Request) if the blog has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/blogs")
    @Timed
    public ResponseEntity<Blog> createBlog(@Valid @RequestBody Blog blog) throws URISyntaxException {
        log.debug("REST request to save Blog : {}", blog);
        if (blog.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("blog", "idexists", "A new blog cannot already have an ID")).body(null);
        }
        Blog result = blogRepository.save(blog);
        blogSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/blogs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("blog", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /blogs : Updates an existing blog.
     *
     * @param blog the blog to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated blog,
     * or with status 400 (Bad Request) if the blog is not valid,
     * or with status 500 (Internal Server Error) if the blog couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/blogs")
    @Timed
    public ResponseEntity<Blog> updateBlog(@Valid @RequestBody Blog blog) throws URISyntaxException {
        log.debug("REST request to update Blog : {}", blog);
        if (blog.getId() == null) {
            return createBlog(blog);
        }
        Blog result = blogRepository.save(blog);
        blogSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("blog", blog.getId().toString()))
            .body(result);
    }

    /**
     * GET  /blogs : get all the blogs.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of blogs in body
     */
    @GetMapping("/blogs")
    @Timed
    public List<Blog> getAllBlogs() {
        log.debug("REST request to get all Blogs");
        List<Blog> blogs = blogRepository.findByUserIsCurrentUser();
        return blogs;
    }

    /**
     * GET  /blogs/:id : get the "id" blog.
     *
     * @param id the id of the blog to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the blog, or with status 404 (Not Found)
     */
    @GetMapping("/blogs/{id}")
    @Timed
    public ResponseEntity<Blog> getBlog(@PathVariable Long id) {
        log.debug("REST request to get Blog : {}", id);
        Blog blog = blogRepository.findOne(id);
        return Optional.ofNullable(blog)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /blogs/:id : delete the "id" blog.
     *
     * @param id the id of the blog to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/blogs/{id}")
    @Timed
    public ResponseEntity<Void> deleteBlog(@PathVariable Long id) {
        log.debug("REST request to delete Blog : {}", id);
        blogRepository.delete(id);
        blogSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("blog", id.toString())).build();
    }

    /**
     * SEARCH  /_search/blogs?query=:query : search for the blog corresponding
     * to the query.
     *
     * @param query the query of the blog search
     * @return the result of the search
     */
    @GetMapping("/_search/blogs")
    @Timed
    public List<Blog> searchBlogs(@RequestParam String query) {
        log.debug("REST request to search Blogs for query {}", query);
        return StreamSupport
            .stream(blogSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }


}
