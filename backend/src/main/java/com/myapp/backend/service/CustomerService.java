package com.myapp.backend.service;

@Service
public class CustomerService {
    private final CustomerRepository repository;
    private final CustomerDTOMapper customerDtoMapper;

    public CustomerService(CustomerRepository repository,
                           CustomerDTOMapper customerDtoMapper) {
        this.repository = repository;
        this.customerDtoMapper=customerDtoMapper;
    }

    public List<CustomerDTO> getCustomers(){
        repository.findAll()
                .stream()
                .map(customerDtoMapper)
                .collect(Collectors.toList());
    }

    public CustomerDTO getCustomer(Integer id){
        repository.findById(id)
                .map(customerDtoMapper)
                .orElseThrow(new ResourceNotFoundException("customer with id [%s] not found".formatted(id)));
    }

    public void addCustomer(CustomerRegistrationRequest customer){
        String email = customerRegistrationRequest.email();
        if (customerDao.existsCustomerWithEmail(email)) {
            throw new DuplicateCustomerException(
                    "Email already taken"
            );
        }


        Customer customer = new Customer(
                customerRegistrationRequest.name(),
                customerRegistrationRequest.email(),
                passwordEncoder.encode(customerRegistrationRequest.password()),
                customerRegistrationRequest.age(),
                customerRegistrationRequest.gender());

        customerDao.insertCustomer(customer);
    }

    public CustomerDTO getCustomer(Integer id){
        repository.findById(id)
                .map(customerDtoMapper)
                .orElseThrow(new ResourceNotFoundException("customer with id [%s] not found".formatted(id)));
    }

    public void deleteCustomerById(Integer customerId) {
        if (!repository.existsById(customerId)) {
            throw new ResourceNotFoundException("customer with id [%s] not found".formatted(customerId));
        }

        repository.deleteById(customerId);
    }
}
