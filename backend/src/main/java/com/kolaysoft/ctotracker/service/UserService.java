package com.kolaysoft.ctotracker.service;

import com.kolaysoft.ctotracker.entity.User;
import com.kolaysoft.ctotracker.entity.enums.Role;
import com.kolaysoft.ctotracker.exception.BusinessRuleException;
import com.kolaysoft.ctotracker.exception.ResourceNotFoundException;
import com.kolaysoft.ctotracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional(readOnly = true)
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanici bulunamadi. ID: " + id));
    }

    @Transactional(readOnly = true)
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanici bulunamadi. Email: " + email));
    }

    @Transactional(readOnly = true)
    public List<User> getUsersByRole(Role role) {
        return userRepository.findByRole(role);
    }

    @Transactional
    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new BusinessRuleException("Bu email adresi zaten kayitli: " + user.getEmail());
        }
        return userRepository.save(user);
    }

    @Transactional
    public User updateUser(Long id, User updatedData) {
        User existing = getUserById(id);

        if (!existing.getEmail().equals(updatedData.getEmail())
                && userRepository.existsByEmail(updatedData.getEmail())) {
            throw new BusinessRuleException("Bu email adresi zaten kayitli: " + updatedData.getEmail());
        }

        existing.setFullName(updatedData.getFullName());
        existing.setEmail(updatedData.getEmail());
        existing.setRole(updatedData.getRole());

        return userRepository.save(existing);
    }

    @Transactional
    public void deactivateUser(Long id) {
        User user = getUserById(id);
        user.setActive(false);
        userRepository.save(user);
    }
}