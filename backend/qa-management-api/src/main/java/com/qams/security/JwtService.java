package com.qams.security;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.qams.entity.User;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JwtService {

    private static final String HMAC_ALGORITHM = "HmacSHA256";
    private static final TypeReference<Map<String, Object>> CLAIMS_TYPE = new TypeReference<>() {
    };

    private final ObjectMapper objectMapper;

    @Value("${security.jwt.secret}")
    private String jwtSecret;

    @Value("${security.jwt.expiration-ms}")
    private long expirationMs;

    public String generateToken(User user) {
        long issuedAt = Instant.now().getEpochSecond();
        long expiresAt = issuedAt + (expirationMs / 1000);

        Map<String, Object> header = new LinkedHashMap<>();
        header.put("alg", "HS256");
        header.put("typ", "JWT");

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("sub", user.getEmail());
        payload.put("role", user.getRole().name());
        payload.put("iat", issuedAt);
        payload.put("exp", expiresAt);

        String encodedHeader = encodeJson(header);
        String encodedPayload = encodeJson(payload);
        String signingInput = encodedHeader + "." + encodedPayload;

        return signingInput + "." + sign(signingInput);
    }

    public String extractUsername(String token) {
        return getStringClaim(token, "sub");
    }

    public String extractRole(String token) {
        return getStringClaim(token, "role");
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        String username = extractUsername(token);

        return username != null
                && username.equals(userDetails.getUsername())
                && !isTokenExpired(token)
                && isSignatureValid(token);
    }

    private boolean isTokenExpired(String token) {
        Number expiresAt = getNumberClaim(token, "exp");

        if (expiresAt == null) {
            return true;
        }

        return Instant.now().getEpochSecond() >= expiresAt.longValue();
    }

    private String getStringClaim(String token, String claimName) {
        Object value = getClaims(token).get(claimName);
        return value != null ? String.valueOf(value) : null;
    }

    private Number getNumberClaim(String token, String claimName) {
        Object value = getClaims(token).get(claimName);
        return value instanceof Number ? (Number) value : null;
    }

    private Map<String, Object> getClaims(String token) {
        try {
            String[] parts = token.split("\\.");

            if (parts.length != 3) {
                return Map.of();
            }

            String payloadJson = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
            return objectMapper.readValue(payloadJson, CLAIMS_TYPE);
        } catch (Exception ex) {
            return Map.of();
        }
    }

    private boolean isSignatureValid(String token) {
        String[] parts = token.split("\\.");

        if (parts.length != 3) {
            return false;
        }

        String signingInput = parts[0] + "." + parts[1];
        String expectedSignature = sign(signingInput);

        return MessageDigest.isEqual(
                expectedSignature.getBytes(StandardCharsets.UTF_8),
                parts[2].getBytes(StandardCharsets.UTF_8)
        );
    }

    private String encodeJson(Map<String, Object> value) {
        try {
            String json = objectMapper.writeValueAsString(value);
            return Base64.getUrlEncoder()
                    .withoutPadding()
                    .encodeToString(json.getBytes(StandardCharsets.UTF_8));
        } catch (JsonProcessingException ex) {
            throw new IllegalStateException("Could not create JWT", ex);
        }
    }

    private String sign(String signingInput) {
        try {
            Mac mac = Mac.getInstance(HMAC_ALGORITHM);
            SecretKeySpec key = new SecretKeySpec(jwtSecret.getBytes(StandardCharsets.UTF_8), HMAC_ALGORITHM);
            mac.init(key);

            return Base64.getUrlEncoder()
                    .withoutPadding()
                    .encodeToString(mac.doFinal(signingInput.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception ex) {
            throw new IllegalStateException("Could not sign JWT", ex);
        }
    }
}
