package com.colasmadagascar.stockinventory.utils;

import io.jsonwebtoken.io.IOException;

import java.io.File;
import java.io.FileInputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Base64;
import java.util.Locale;

public class Utils {
    public static String formatTimestamp(String timestampStr) {
        try {
            // Define the input timestamp format
            DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSSSSS");

            // Parse the timestamp string using the defined format
            LocalDateTime localDateTime = LocalDateTime.parse(timestampStr, inputFormatter);

            // Specify the desired time zone (e.g., "Europe/Paris")
            ZoneId zoneId = ZoneId.of("Europe/Paris");
            Locale locale = Locale.FRANCE;

            // Create a DateTimeFormatter for the desired output format
            DateTimeFormatter outputFormatter = DateTimeFormatter.ofPattern("dd MMMM yyyy HH'h'mm", locale);

            // Format the LocalDateTime object to a String in the specified time zone
            return localDateTime.atZone(zoneId).format(outputFormatter);

        } catch (DateTimeParseException e) {
            System.err.println("Could not parse timestamp: " + e.getMessage());
            throw e;
        }
    }

    public static String createFamilleLogRef(String label) {
        String[] words = label.split(" ");
        StringBuilder sb = new StringBuilder();
        for (String word : words) {
            sb.append(word.toUpperCase().charAt(0)).append(word.toUpperCase().charAt(1));
        }
        return sb.toString();
    }

    public static String generateSKU(String article, String famille, String sousFamille, String service) {
        StringBuilder stringBuilder = new StringBuilder();
        LocalDate currentDate = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        String formattedDate = currentDate.format(formatter);
        stringBuilder.append(createFamilleLogRef(service)).append("-")
                .append(createFamilleLogRef(famille)).append("/")
                .append(createFamilleLogRef(sousFamille)).append("-")
                .append(createFamilleLogRef(article)).append("-")
                .append(formattedDate);

        return stringBuilder.toString();
    }

    public static String formatTimestamp(LocalDateTime localDateTime) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMMM yyyy", Locale.FRENCH);
        return formatter.format(localDateTime);
    }

    public static String encodeImageToBase64(String imagePath) throws IOException, java.io.IOException {
        File file = new File(imagePath);
        FileInputStream inputStream = new FileInputStream(file);
        byte[] bytes = new byte[(int) file.length()];
        inputStream.read(bytes);
        inputStream.close();
        return Base64.getEncoder().encodeToString(bytes);
    }
}
