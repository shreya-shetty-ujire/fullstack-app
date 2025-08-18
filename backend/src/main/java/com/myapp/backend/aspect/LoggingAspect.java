package com.myapp.backend.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;


@Aspect
@Component
public class LoggingAspect {
    private static final Logger log = LoggerFactory.getLogger(LoggingAspect.class);

    @Before("execution(* com.myapp.backend.service..*(..)) || execution(* com.myapp.backend.controller..*(..))")
    public void logBefore(JoinPoint joinPoint) {
        log.info("Entering method: {} with args {}",
                joinPoint.getSignature().toShortString(),
                joinPoint.getArgs());
    }

    @AfterReturning(pointcut="execution(* com.myapp.backend.service..*(..)) || execution(* com.myapp.backend.controller..*(..))", returning = "result")
    public void logAfter(JoinPoint joinPoint, Object result) {
        log.info("Exiting method: {} with result {}",
                joinPoint.getSignature().toShortString(),
                result);
    }
}