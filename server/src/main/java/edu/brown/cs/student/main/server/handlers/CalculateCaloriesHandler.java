package edu.brown.cs.student.main.server.handlers;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;

import edu.brown.cs.student.main.server.storage.StorageInterface;
import spark.Request;
import spark.Response;
import spark.Route;

public class CalculateCaloriesHandler implements Route {
  private final StorageInterface storageHandler;
  private final List<CalorieEquationEntry> equationTable;

  public CalculateCaloriesHandler(StorageInterface storageHandler) {
    this.storageHandler = storageHandler;
    try {
      this.equationTable = CSVLoaderUtil.loadCalorieEquations("datasets/calorie_equations.csv");
    } catch (IOException e) {
      throw new RuntimeException("Failed to load calorie equations: " + e.getMessage());
    }
  }

  @Override
  public Object handle(Request request, Response response) {
    Map<String, Object> responseMap = new HashMap<>();
    response.type("application/json");

    String uid = request.queryParams("uid");
    if (uid == null || uid.isEmpty()) {
      responseMap.put("response_type", "failure");
      responseMap.put("error", "Missing uid query parameter.");
      return Utils.toMoshiJson(responseMap);
    }

    try {
      Firestore db = FirestoreClient.getFirestore();
      DocumentSnapshot userData = db.collection("profiles").document(uid).get().get();

      if (userData == null || !userData.exists()) {
        responseMap.put("response_type", "failure");
        responseMap.put("error", "No data found for uid.");
        return Utils.toMoshiJson(responseMap);
      }

      Object ageObj = userData.get("age");
      Object heightObj = userData.get("updatedHeight");
      Object weightObj = userData.get("updatedWeight");
      Object sexObj = userData.get("sex");
      Object ageGroupObj = userData.get("ageGroup");
      Object activityLevelObj = userData.get("activityLevel");

      if (ageObj == null
          || heightObj == null
          || weightObj == null
          || sexObj == null
          || ageGroupObj == null
          || activityLevelObj == null) {
        responseMap.put("response_type", "failure");
        responseMap.put("error", "Missing required profile fields.");
        return Utils.toMoshiJson(responseMap);
      }

      double age = ((Number) ageObj).doubleValue();
      double height = ((Number) heightObj).doubleValue();
      double weight = ((Number) weightObj).doubleValue();
      String sex = sexObj.toString();
      String ageGroup = ageGroupObj.toString();
      String activityLevel = activityLevelObj.toString();

      CalorieEquationEntry entry = findEquation(sex, ageGroup, activityLevel);
      if (entry == null) {
        responseMap.put("response_type", "failure");
        responseMap.put("error", "No matching equation found for user parameters.");
        return Utils.toMoshiJson(responseMap);
      }

      String rawEquation = entry.equation();
      double calories = evaluateEquation(rawEquation, age, height, weight);
      double protein = Math.round(weight * 0.8 * 10.0) / 10.0;
      double carbs = Math.round(calories * 0.55) / 4.0;
      double sugar = (calories * 0.10) / 4.0;

      responseMap.put("response_type", "success");
      responseMap.put("calories", calories);
      responseMap.put("protein", protein);
      responseMap.put("carbs", carbs);
      responseMap.put("sugar", sugar);
      responseMap.put("equation", rawEquation);
    } catch (Exception e) {
      responseMap.put("response_type", "failure");
      responseMap.put("error", "Failed to calculate calories: " + e.getMessage());
    }

    return Utils.toMoshiJson(responseMap);
  }

  private CalorieEquationEntry findEquation(String sex, String ageGroup, String activityLevel) {
    for (CalorieEquationEntry entry : this.equationTable) {
      if (entry.sex().equalsIgnoreCase(sex) && entry.ageGroup().equalsIgnoreCase(ageGroup)) {
        if ("0–2 years".equalsIgnoreCase(ageGroup)) {
          return entry;
        } else if (entry.activityLevel().equalsIgnoreCase(activityLevel)) {
          return entry;
        }
      }
    }
    return null;
  }

  private double evaluateEquation(String equation, double age, double height, double weight) {
    String expr = equation.replace("TEE =", "").trim();
    expr = expr.replaceAll("×", "*");
    expr = expr.replaceAll("–", "-");

    expr = expr.replace(",", "");

    expr = expr.replaceAll("age", String.valueOf(age));
    expr = expr.replaceAll("height", String.valueOf(height));
    expr = expr.replaceAll("weight", String.valueOf(weight));

    return Utils.evalMathExpression(expr);
  }
}
