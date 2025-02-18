package ro.tuc.ds2020.dtos.builders;

import ro.tuc.ds2020.dtos.PersonDTO;
import ro.tuc.ds2020.dtos.PersonDetailsDTO;
import ro.tuc.ds2020.entities.Person;

public class PersonBuilder {

    private PersonBuilder() {}

    public static PersonDTO toPersonDTO(Person person) {
        return new PersonDTO(person.getId(), person.getUsername(), person.getRole());
    }

    public static PersonDetailsDTO toPersonDetailsDTO(Person person) {
        return new PersonDetailsDTO(person.getId(), person.getUsername(), person.getPassword(), person.getRole());
    }

    public static Person toEntity(PersonDetailsDTO personDetailsDTO) {
        return new Person(personDetailsDTO.getUsername(),
                personDetailsDTO.getPassword(),
                personDetailsDTO.getRole());
    }
}
