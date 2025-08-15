package com.myapp.backend.SecurityConfig;

import com.myapp.backend.entity.Customer;
import com.myapp.backend.entity.Gender;
import com.myapp.backend.entity.Role;
import com.myapp.backend.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@Configuration
public class Config {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration
    ) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(
            UserDetailsService userDetailsService,
            PasswordEncoder passwordEncoder
    ) {
        DaoAuthenticationProvider daoAuthenticationProvider =
                new DaoAuthenticationProvider();
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder);
        daoAuthenticationProvider.setUserDetailsService(userDetailsService);
        return daoAuthenticationProvider;
    }
    @Bean
    CommandLineRunner createAdmin(
            CustomerRepository repository,
            PasswordEncoder encoder,
            @Value("${admin1.email}") String admin1Email,
            @Value("${admin1.password}") String admin1Password,
            @Value("${admin2.email}") String admin2Email,
            @Value("${admin2.password}") String admin2Password,
            @Value("${admin3.email}") String admin3Email,
            @Value("${admin3.password}") String admin3Password
    ) {
        return args -> {
            if (!repository.existsCustomerByEmail(admin1Email)) {
                Customer admin = new Customer("Admin User", admin1Email, encoder.encode(admin1Password), 30, Gender.MALE);
                admin.setRoles(Set.of(Role.ADMIN));
                repository.save(admin);
            }

            if (!repository.existsCustomerByEmail(admin2Email)) {
                Customer admin1 = new Customer("Admin One", admin2Email, encoder.encode(admin2Password), 30, Gender.MALE);
                admin1.setRoles(Set.of(Role.ADMIN));
                repository.save(admin1);
            }

            if (!repository.existsCustomerByEmail(admin3Email)) {
                Customer admin2 = new Customer("Admin Two", admin3Email, encoder.encode(admin3Password), 32, Gender.FEMALE);
                admin2.setRoles(Set.of(Role.ADMIN));
                repository.save(admin2);
            }
        };
    }

}
