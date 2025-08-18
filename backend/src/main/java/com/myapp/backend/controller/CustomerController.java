package com.myapp.backend.controller;


import com.myapp.backend.dto.CustomerDTO;
import com.myapp.backend.dto.CustomerRegistrationRequest;
import com.myapp.backend.dto.CustomerUpdateRequest;
import com.myapp.backend.jwt.JwtUtil;
import com.myapp.backend.service.CustomerService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("api/customers")
public class CustomerController {

    private final CustomerService customerService;
    private final JwtUtil jwtUtil;

    public CustomerController(CustomerService customerService,
                              JwtUtil jwtUtil) {
        this.customerService = customerService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public List<CustomerDTO> getCustomers() {
        return customerService.getCustomers();
    }


    @GetMapping("{customerId}")
    public CustomerDTO getCustomer(
            @PathVariable("customerId") Integer customerId) {
        return customerService.getCustomer(customerId);
    }

    @PostMapping
    public ResponseEntity<?> registerCustomer(
            @RequestBody CustomerRegistrationRequest request) {
        customerService.addCustomer(request);
        String jwtToken = jwtUtil.issueToken(request.email(), "ROLE_USER");
        return ResponseEntity.ok()
                .header(HttpHeaders.AUTHORIZATION, jwtToken)
                .build();
    }

    @DeleteMapping("{customerId}")
    public void deleteCustomer(
            @PathVariable("customerId") Integer customerId) {
        customerService.deleteCustomerById(customerId);
    }

    @PutMapping("{customerId}")
    public void updateCustomer(
            @PathVariable("customerId") Integer customerId,
            @RequestBody CustomerUpdateRequest updateRequest) {
        customerService.updateCustomer(customerId, updateRequest);
    }

    @GetMapping("/profile")
    public CustomerDTO getCustomerProfile(@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        String jwt = token.replace("Bearer ", "");
        String email = jwtUtil.getSubject(jwt);
        return customerService.getCustomerByEmail(email);
    }

    @PostMapping(
            value = "{customerId}/profile-image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public void uploadCustomerProfileImage(
            @PathVariable("customerId") Integer customerId,
            @RequestParam("file") MultipartFile file) {
        customerService.uploadCustomerProfileImage(customerId, file);
    }

    @GetMapping(
            value = "{customerId}/profile-image"
    )
    public ResponseEntity<byte[]> getCustomerProfileImage(@PathVariable Integer customerId) {
        byte[] image = customerService.getCustomerProfileImage(customerId);

        return ResponseEntity
                .ok()
                .header("Content-Type", "image/*")
                .body(image);
    }

}