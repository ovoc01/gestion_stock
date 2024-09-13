package com.colasmadagascar.stockinventory.utils;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
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
}
