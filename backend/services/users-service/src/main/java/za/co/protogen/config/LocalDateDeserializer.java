package za.co.protogen.config;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import org.threeten.bp.LocalDate;
import org.threeten.bp.format.DateTimeFormatter;

import java.io.IOException;

public class LocalDateDeserializer extends JsonDeserializer<LocalDate> {

    @Override
    public LocalDate deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String dateAsString = p.getValueAsString();
        if (dateAsString == null || dateAsString.isEmpty()) {
            return null;
        }

        return LocalDate.parse(dateAsString, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
    }
}

