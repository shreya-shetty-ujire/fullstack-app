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

    public CustomerService(CustomerRepository repository,
                           CustomerDTOMapper customerDtoMapper, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.customerDtoMapper = customerDtoMapper;
        this.passwordEncoder = passwordEncoder;
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

    //    public void uploadCustomerProfileImage(Integer customerId,
//                                           MultipartFile file) {
//        checkIfCustomerExistsOrThrow(customerId);
//        String profileImageId = UUID.randomUUID().toString();
//        try {
//            s3Service.putObject(
//                    s3Buckets.getCustomer(),
//                    "profile-images/%s/%s".formatted(customerId, profileImageId),
//                    file.getBytes()
//            );
//        } catch (IOException e) {
//            throw new RuntimeException("failed to upload profile image", e);
//        }
//        customerDao.updateCustomerProfileImageId(profileImageId, customerId);
//    }
//        private void checkIfCustomerExistsOrThrow(Integer customerId) {
//        if (!repository.existsById(customerId)) {
//            throw new ResourceNotFoundException(
//                    "Customer with id [%s] not found".formatted(customerId)
//            );
//        }
//    }
    @PreAuthorize("hasRole('ADMIN') or #customerId == authentication.principal.id")
    public void uploadCustomerProfileImage(Integer customerId, MultipartFile file) {
        Customer customer = repository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Customer with id [%s] not found".formatted(customerId)
                ));

        // Build absolute path
        File dir = new File(uploadBaseDir, "profile-images/" + customerId);
        if (!dir.exists()) {
            if (!dir.mkdirs()) {
                throw new RuntimeException("Failed to create upload directory: " + dir.getAbsolutePath());
            }
        }

        String filename = UUID.randomUUID() + "-" + file.getOriginalFilename();
        File destinationFile = new File(dir, filename);

        try {
            file.transferTo(destinationFile);
        } catch (IOException e) {
            throw new RuntimeException("Failed to save profile image", e);
        }
        customer.setProfileImageId(filename);
        repository.save(customer);
    }

    private File getFileOrNull(Integer customerId, Customer customer) {
        if (customer.getProfileImageId() == null || customer.getProfileImageId().isBlank()) {
            return null;
        }

        File file = new File(uploadBaseDir + "/profile-images/" + customerId, customer.getProfileImageId());
        if (!file.exists()) {
            return null;
        }

        return file;
    }



    public byte[] getCustomerProfileImage(Integer customerId) {
        Customer customer = repository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Customer with id [%s] not found".formatted(customerId)
                ));

        File file = getFileOrNull(customerId, customer);
        if (file == null) {
            return null; // frontend can check for null
        }

        try {
            return Files.readAllBytes(file.toPath());
        } catch (IOException e) {
            throw new RuntimeException("Failed to read profile image", e);
        }
    }


}
        
