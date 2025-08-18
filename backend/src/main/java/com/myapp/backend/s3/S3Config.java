package com.myapp.backend.s3;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

import java.net.URI;

@Configuration
public class S3Config {

    @Value("${aws.s3.mock}")
    private boolean mock;

    @Bean
    public S3Client s3Client() {
        if (mock) {
            return new FakeS3();  // for mock S3
        }
        return S3Client.builder()
                .region(Region.of("us-east-1"))
                .endpointOverride(URI.create("http://localhost:9090")) // S3Mock endpoint
                .forcePathStyle(true) // important for mocks
                .build(); // for aws s3
    }

}