package com.myapp.backend.service;

import com.myapp.backend.entity.Customer;
import com.myapp.backend.entity.Gender;
import com.myapp.backend.entity.Role;
import com.myapp.backend.repository.CustomerRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.Set;

@Service
public class CsvUserLoader {
    private final CustomerRepository repository;
    private final PasswordEncoder encoder;

    public CsvUserLoader(CustomerRepository repository, PasswordEncoder encoder) {
        this.repository = repository;
        this.encoder = encoder;
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void loadUsersFromMultipart(MultipartFile file) {
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream()))) {

            String line;
            boolean isFirstLine = true;

            while ((line = reader.readLine()) != null) {
                if (isFirstLine) {
                    isFirstLine = false; // Skip header row
                    continue;
                }

                String[] values = line.split(",");

                String name = values[0].trim();
                String email = values[1].trim();
                String password = values[2].trim();
                int age = Integer.parseInt(values[3].trim());
                Gender gender = Gender.valueOf(values[4].trim().toUpperCase());

                if(!repository.existsCustomerByEmail(email)){
                    Customer customer = new Customer(name, email, encoder.encode(password), age, gender);
                    customer.setRoles(Set.of(Role.USER));
                    repository.save(customer);
                }
            }

        }catch (Exception e) {
            throw new RuntimeException("Error reading uploaded CSV file", e);
        }

    }
}
