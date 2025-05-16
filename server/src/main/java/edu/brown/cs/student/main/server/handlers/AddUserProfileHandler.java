package edu.brown.cs.student.main.server.handlers;

import static spark.utils.StringUtils.isBlank;

import edu.brown.cs.student.main.server.storage.StorageInterface;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;

public class AddUserProfileHandler implements Route {

  private final StorageInterface storageHandler;

  public AddUserProfileHandler(StorageInterface storageHandler) {
    this.storageHandler = storageHandler;
  }

  @Override
  public Object handle(Request request, Response response) {
    Map<String, Object> responseMap = new HashMap<>();
    try {
      String uid = request.queryParams("uid");
      String name = request.queryParams("name");
      String sex = request.queryParams("sex");
      String birthday = request.queryParams("birthday");
      String height = request.queryParams("height");
      String weight = request.queryParams("weight");
      String activityLevel = request.queryParams("activityLevel");
      String heightUnit = request.queryParams("heightUnit");
      String weightUnit = request.queryParams("weightUnit");

      if (isBlank(uid) || isBlank(name) || isBlank(sex) || isBlank(birthday) ||
          isBlank(height) || isBlank(weight) || isBlank(activityLevel) ||
          isBlank(heightUnit) || isBlank(weightUnit)) {
        response.status(400);
        responseMap.put("response_type", "error");
        responseMap.put("error", "Missing one or more required parameters.");
        return Utils.toMoshiJson(responseMap);
      }

      double heightVal;
      double weightVal;

      try {
        heightVal = Double.parseDouble(height);
      } catch (NumberFormatException e) {
        response.status(400);
        responseMap.put("response_type", "error");
        responseMap.put("error", "Invalid height format: must be a number.");
        return Utils.toMoshiJson(responseMap);
      }

      if ("in".equals(heightUnit)) {
        heightVal *= 2.54;
      }

      try {
        weightVal = Double.parseDouble(weight);
      } catch (NumberFormatException e) {
        response.status(400);
        responseMap.put("response_type", "error");
        responseMap.put("error", "Invalid weight format: must be a number.");
        return Utils.toMoshiJson(responseMap);
      }

      if ("lbs".equals(weightUnit)) {
        weightVal *= 0.453592;
      }

      LocalDate birthDate = LocalDate.parse(birthday, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
      LocalDate currentDate = LocalDate.now();
      int age = Period.between(birthDate, currentDate).getYears();

      String ageGroup;
      if (age >= 19) {
        ageGroup = "19 years and above";
      } else if (age >= 3) {
        ageGroup = "3–18 years";
      } else {
        ageGroup = "0–2 years";
      }

      Map<String, Object> profileData = new HashMap<>();
      profileData.put("user-id", uid);
      profileData.put("name", name);
      profileData.put("sex", sex);
      profileData.put("birthday", birthday);
      profileData.put("age", age);
      profileData.put("height", height);
      profileData.put("updatedHeight", heightVal);
      profileData.put("weight", weight);
      profileData.put("updatedWeight", weightVal);
      profileData.put("activityLevel", activityLevel);
      profileData.put("ageGroup", ageGroup);
      profileData.put("heightUnit", heightUnit);
      profileData.put("weightUnit", weightUnit);

      String docId = "profile-" + uid;

      storageHandler.addDocument("profiles", docId, profileData);

      response.status(200);
      responseMap.put("response_type", "success");
      responseMap.put("savedData", profileData);
    } catch (Exception e) {
      e.printStackTrace();
      response.status(500);
      responseMap.put("response_type", "error");
      responseMap.put("error", e.getMessage());
    }

    return Utils.toMoshiJson(responseMap);
  }
}
