package edu.brown.cs.student.main.server.handlers;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class CSVLoaderUtil {

  public static List<CalorieEquationEntry> loadCalorieEquations(String filePath)
      throws IOException {
    List<CalorieEquationEntry> entries = new ArrayList<>();
    try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {
      String line;
      while ((line = br.readLine()) != null) {
        String[] parts = line.split(",", 4);
        if (parts.length == 4) {
          String sex = parts[0].trim();
          String ageGroup = parts[1].trim();
          String activityLevel = parts[2].trim();
          String equation = parts[3].trim().replaceAll("\"", "");

          entries.add(new CalorieEquationEntry(sex, ageGroup, activityLevel, equation));
        }
      }
    }
    return entries;
  }
}
