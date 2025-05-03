package edu.brown.cs.student.main.server.handlers;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import edu.brown.cs.student.main.server.storage.StorageInterface;
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
      String birthday = request.queryParams("birthday");
      String height = request.queryParams("height");
      String weight = request.queryParams("weight");

      if (uid == null || name == null || birthday == null || height == null || weight == null) {
        throw new IllegalArgumentException("Missing one or more required parameters.");
      }

      Map<String, Object> profileData = new HashMap<>();
      profileData.put("user-id", uid);
      profileData.put("name", name);
      profileData.put("birthday", birthday);
      profileData.put("height", height);
      profileData.put("weight", weight);
      profileData.put("time", LocalDateTime.now().toString());

      String docId = "profile-" + uid;

      storageHandler.addDocument("profiles", docId, profileData);

      responseMap.put("response_type", "success");
    } catch (Exception e) {
      e.printStackTrace();
      responseMap.put("response_type", "failure");
      responseMap.put("error", e.getMessage());
    }

    return Utils.toMoshiJson(responseMap);
  }
}
