package edu.brown.cs.student.main.server.handlers;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import edu.brown.cs.student.main.server.storage.StorageInterface;
import spark.Request;
import spark.Response;
import spark.Route;

public class AddDailyNutrientsHandler implements Route {

  private final StorageInterface storageHandler;

  public AddDailyNutrientsHandler(StorageInterface storageHandler) {
    this.storageHandler = storageHandler;
  }

  @Override
  public Object handle(Request request, Response response) {
    Map<String, Object> responseMap = new HashMap<>();
    try {
      String uid = request.queryParams("uid");
      String date = request.queryParams("date");
      String calories = request.queryParams("calories");
      String sugar = request.queryParams("sugar");
      String carbs = request.queryParams("carbs");
      String protein = request.queryParams("protein");

      if (uid == null || calories == null || sugar == null || carbs == null || protein == null) {
        throw new IllegalArgumentException("Missing one or more required parameters.");
      }

      Map<String, Object> dailyNutrients = new HashMap<>();
      dailyNutrients.put("user-id", uid);
      dailyNutrients.put("Calories", calories);
      dailyNutrients.put("Sugar", sugar);
      dailyNutrients.put("Carbs", carbs);
      dailyNutrients.put("Protein", protein);
      dailyNutrients.put("date", date);
      dailyNutrients.put("time", LocalDateTime.now().toString());

      String docId = "profile-" + uid;

      storageHandler.addDaily("profiles", docId, "daily_logs", date, dailyNutrients);

      responseMap.put("response_type", "success");
    } catch (Exception e) {
      e.printStackTrace();
      responseMap.put("response_type", "failure");
      responseMap.put("error", e.getMessage());
    }

    return Utils.toMoshiJson(responseMap);
  }
}
