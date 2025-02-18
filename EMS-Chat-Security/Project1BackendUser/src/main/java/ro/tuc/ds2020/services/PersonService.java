package ro.tuc.ds2020.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import ro.tuc.ds2020.controllers.handlers.exceptions.model.ResourceNotFoundException;
import ro.tuc.ds2020.dtos.PersonDTO;
import ro.tuc.ds2020.dtos.PersonDetailsDTO;
import ro.tuc.ds2020.dtos.builders.PersonBuilder;
import ro.tuc.ds2020.entities.Person;
import ro.tuc.ds2020.repositories.PersonRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PersonService {
    private static final Logger LOGGER = LoggerFactory.getLogger(PersonService.class);
    private final PersonRepository personRepository;

    private final RestTemplate restTemplate = new RestTemplate();

    @Autowired
    public PersonService(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    public List<PersonDTO> findPersons() {
        List<Person> personList = personRepository.findAll();
        return personList.stream()
                .map(PersonBuilder::toPersonDTO)
                .collect(Collectors.toList());
    }


    public PersonDetailsDTO findPersonById(UUID id) {
        Optional<Person> personOptional = personRepository.findById(id);
        if (!personOptional.isPresent()) {
            LOGGER.error("Person with id {} was not found in db", id);
            throw new ResourceNotFoundException(Person.class.getSimpleName() + " with id: " + id);
        }
        return PersonBuilder.toPersonDetailsDTO(personOptional.get());
    }

    public UUID insert(PersonDetailsDTO personDTO) {
        Person person = new Person(
                personDTO.getUsername(),
                personDTO.getPassword(),
                personDTO.getRole()
        );
        person = personRepository.save(person);
        LOGGER.debug("Person with id {} was inserted in db", person.getId());
        return person.getId();
    }

    public UUID update(UUID personId, PersonDetailsDTO personDTO) {
        Optional<Person> personOptional = personRepository.findById(personId);
        if (!personOptional.isPresent()) {
            LOGGER.error("Person with id {} was not found in db", personId);
            throw new ResourceNotFoundException(Person.class.getSimpleName() + " with id: " + personId);
        }

        Person personToUpdate = personOptional.get();

        personToUpdate.setUsername(personDTO.getUsername());
        personToUpdate.setPassword(personDTO.getPassword());  // Typically, the password should be hashed
        personToUpdate.setRole(personDTO.getRole());

        personRepository.save(personToUpdate);
        LOGGER.debug("Person with id {} was updated in db", personId);
        return personToUpdate.getId();
    }

    public void delete(UUID personId) {
        Optional<Person> personOptional = personRepository.findById(personId);
        if (!personOptional.isPresent()) {
            LOGGER.error("Person with id {} was not found in db", personId);
            throw new ResourceNotFoundException(Person.class.getSimpleName() + " with id: " + personId);
        }

        try {
            //String deviceServiceUrl = "http://localhost:8082/device/user-devices/" + personId;
            String deviceServiceUrl = "http://device-demo:8082/device/user-devices/" + personId;
            ResponseEntity<Void> response = restTemplate.exchange(deviceServiceUrl, HttpMethod.DELETE, null, Void.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                LOGGER.debug("Successfully notified Device Microservice to delete devices for user {}", personId);
                personRepository.delete(personOptional.get());
                LOGGER.debug("Person with id {} was deleted from db", personId);
            } else {
                LOGGER.warn("Device Microservice returned non-success status for user {}", personId);
            }
        } catch (Exception e) {
            LOGGER.error("Failed to notify Device Microservice for user {}. Error: {}", personId, e.getMessage());
        }
    }
}
