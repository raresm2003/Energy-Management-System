package ro.tuc.ds2020.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.tuc.ds2020.entities.Person;
import ro.tuc.ds2020.repositories.PersonRepository;

import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private PersonRepository userRepository;

    public boolean login(String username, String password) {
        Person user = userRepository.findByUsername(username);
        if (user != null && password.equals(user.getPassword())) {
            return true;
        }
        return false;
    }

    public String getRole(String username) {
        Person user = userRepository.findByUsername(username);
        if (user != null) {
            return user.getRole();
        }
        return null;
    }

    public UUID getId(String username) {
        Person user = userRepository.findByUsername(username);
        if (user != null) {
            return user.getId();
        }
        return null;
    }
}
