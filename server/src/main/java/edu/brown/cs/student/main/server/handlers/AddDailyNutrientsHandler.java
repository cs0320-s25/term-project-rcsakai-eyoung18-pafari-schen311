package edu.brown.cs.student.main.server.handlers;

import edu.brown.cs.student.main.server.storage.StorageInterface;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
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

      if (uid == null || date == null) {
        response.status(400);
        responseMap.put("response_type", "error");
        responseMap.put("error", "Missing uid or date");
        return Utils.toMoshiJson(responseMap);
      }

      if (calories == null || sugar == null || carbs == null || protein == null) {
        response.status(400);
        responseMap.put("response_type", "error");
        responseMap.put("error", "Missing one or more required parameters.");
        return Utils.toMoshiJson(responseMap);
      }

      Map<String, Object> dailyNutrients = new HashMap<>();
      dailyNutrients.put("user-id", uid);
      dailyNutrients.put("Calories", calories);
      dailyNutrients.put("Sugar", sugar);
      dailyNutrients.put("Carbs", carbs);
      dailyNutrients.put("Protein", protein);
      dailyNutrients.put("date", date);

      String docId = "profile-" + uid;

      storageHandler.addDaily("profiles", docId, "daily_logs", date, dailyNutrients);

      response.status(200);
      responseMap.put("response_type", "success");
      responseMap.put("savedData", dailyNutrients);
    } catch (Exception e) {
      e.printStackTrace();
      response.status(500);
      responseMap.put("response_type", "error");
      responseMap.put("error", e.getMessage());
    }

    return Utils.toMoshiJson(responseMap);
  }
}
