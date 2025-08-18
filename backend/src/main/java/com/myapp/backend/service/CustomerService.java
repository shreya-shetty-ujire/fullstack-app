package com.myapp.backend.service;

import com.myapp.backend.Exception.DuplicateCustomerException;
import com.myapp.backend.Exception.ResourceNotFoundException;
import com.myapp.backend.dto.CustomerDTO;
import com.myapp.backend.dto.CustomerDTOMapper;
import com.myapp.backend.dto.CustomerRegistrationRequest;
import com.myapp.backend.dto.CustomerUpdateRequest;
import com.myapp.backend.entity.Customer;
import com.myapp.backend.entity.Role;
import com.myapp.backend.repository.CustomerRepository;
import com.myapp.backend.s3.S3Buckets;
import com.myapp.backend.s3.S3Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CustomerService {
    private final CustomerRepository repository;
    private final CustomerDTOMapper customerDtoMapper;
    private final PasswordEncoder passwordEncoder;
    private final S3Service s3Service;
    private final S3Buckets s3Buckets;

    public CustomerService(CustomerRepository repository,
                           CustomerDTOMapper customerDtoMapper, PasswordEncoder passwordEncoder, S3Service s3Service,S3Buckets s3Buckets) {
        this.repository = repository;
        this.customerDtoMapper = customerDtoMapper;
        this.passwordEncoder = passwordEncoder;
        this.s3Service = s3Service;
        this.s3Buckets = s3Buckets;
    }
    @Value("${app.upload.dir:${user.home}/myapp-uploads}")
    private String uploadBaseDir;

    public List <CustomerDTO> getCustomers() {
        return repository.findAll()
                .stream()
                .map(customerDtoMapper)
                .collect(Collectors.toList());
    }

    public CustomerDTO getCustomer(Integer id) {
        return repository.findById(id)
                .map(customerDtoMapper)
                .orElseThrow(() -> new ResourceNotFoundException("customer with id [%s] not found".formatted(id)));
    }


    public void addCustomer(CustomerRegistrationRequest customer) {
        String email = customer.email();
        if (repository.existsCustomerByEmail(email)) {
            throw new DuplicateCustomerException(
                    "Email already taken"
            );
        }


        Customer newcustomer = new Customer(
                customer.name(),
                customer.email(),
                passwordEncoder.encode(customer.password()),
                customer.age(),
                customer.gender());

        newcustomer.setRoles(Set.of(Role.USER));

        repository.save(newcustomer);
    }

    @PreAuthorize("hasRole('ADMIN') or #customerId == authentication.principal.id")
    public void updateCustomer(Integer customerId, CustomerUpdateRequest request) {
        Customer customer = repository.findById(customerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Customer with id [%s] not found".formatted(customerId)));

        if (request.name() != null && !request.name().isBlank()) {
            customer.setName(request.name());
        }

        if (request.email() != null && !request.email().isBlank()) {
            customer.setEmail(request.email());
        }

        if (request.age() != null) {
            customer.setAge(request.age());
        }
        repository.save(customer);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteCustomerById(Integer customerId) {
        if (!repository.existsById(customerId)) {
            throw new ResourceNotFoundException("customer with id [%s] not found".formatted(customerId));
        }

        repository.deleteById(customerId);
    }

    public CustomerDTO getCustomerByEmail(String email) {
        return repository.findCustomerByEmail(email)
                .map(customerDtoMapper)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
    }

    @PreAuthorize("hasRole('ADMIN') or #customerId == authentication.principal.id")
        public void uploadCustomerProfileImage(Integer customerId,
                                           MultipartFile file) {
        checkIfCustomerExistsOrThrow(customerId);
        String profileImageId = UUID.randomUUID().toString();
        try {
            s3Service.putObject(
                    s3Buckets.getCustomer(),
                    "profile-images/%s/%s".formatted(customerId, profileImageId),
                    file.getBytes()
            );
        } catch (IOException e) {
            throw new RuntimeException("failed to upload profile image", e);
        }
        repository.updateCustomerProfileImageId(profileImageId, customerId);
    }
        private void checkIfCustomerExistsOrThrow(Integer customerId) {
        if (!repository.existsById(customerId)) {
            throw new ResourceNotFoundException(
                    "Customer with id [%s] not found".formatted(customerId)
            );
        }
    }

    public byte[] getCustomerProfileImage(Integer customerId) {
        var customer = repository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "customer with id [%s] not found".formatted(customerId)
                ));

        if (customer.getProfileImageId() == null || customer.getProfileImageId().isBlank()) {
            throw new ResourceNotFoundException(
                    "Profile image for customer [%s] not found".formatted(customerId)
            );
        }

        return s3Service.getObject(
                s3Buckets.getCustomer(),
                "profile-images/%s/%s".formatted(customerId, customer.getProfileImageId())
        );
    }


}
        
