package ro.tuc.ds2020.controllers;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Link;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.dtos.PersonDTO;
import ro.tuc.ds2020.dtos.PersonDetailsDTO;
import ro.tuc.ds2020.services.PersonService;

import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
@CrossOrigin
@RequestMapping(value = "/person")
public class PersonController {

    private final PersonService personService;
    private static final String SECRET_KEY = "f7a26d7c2be2d7eada68f44004b1706608ec5bbebdecb7d5f95f61ec34b3de4b";

    @Autowired
    public PersonController(PersonService personService) {
        this.personService = personService;
    }

    @GetMapping()
    public ResponseEntity<List<PersonDTO>> getPersons(@RequestHeader("Authorization") String token) {
        try {
            // Parse and validate the token
            Claims claims = Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .parseClaimsJws(token)
                    .getBody();

            // Optionally, you can retrieve user details or roles from the token
            String username = claims.getSubject();
            String role = claims.get("role", String.class);
            String userId = claims.get("userId", String.class);

            System.out.println("Token validated for user: " + username);
            System.out.println("User role: " + role);
            System.out.println("User ID: " + userId);

            // Fetch and return the person data
            List<PersonDTO> dtos = personService.findPersons();
            for (PersonDTO dto : dtos) {
                Link personLink = linkTo(methodOn(PersonController.class)
                        .getPerson(dto.getId())).withRel("personDetails");
                dto.add(personLink);
            }
            return new ResponseEntity<>(dtos, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping()
    public ResponseEntity<UUID> insertPerson(@Valid @RequestBody PersonDetailsDTO personDTO) {
        UUID personID = personService.insert(personDTO);
        return new ResponseEntity<>(personID, HttpStatus.CREATED);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<PersonDetailsDTO> getPerson(@PathVariable("id") UUID personId) {
        System.out.println(personId);
        PersonDetailsDTO dto = personService.findPersonById(personId);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<UUID> updatePerson(@PathVariable("id") UUID personId, @Valid @RequestBody PersonDetailsDTO personDTO) {
        UUID updatedPersonId = personService.update(personId, personDTO);
        return new ResponseEntity<>(updatedPersonId, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> deletePerson(@PathVariable("id") UUID personId) {
        personService.delete(personId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
