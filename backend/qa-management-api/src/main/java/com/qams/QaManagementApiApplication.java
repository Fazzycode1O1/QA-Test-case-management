package com.qams;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class QaManagementApiApplication {

    public static void main(String[] args) {
        // Supabase direct DB host resolves to IPv6 only (AAAA record, no A record).
        // This must be set before any network I/O so the JDBC driver resolves the hostname correctly.
        System.setProperty("java.net.preferIPv6Addresses", "true");
        SpringApplication.run(QaManagementApiApplication.class, args);
    }
}
