package edu.brown.cs.student.main.server.handlers;

import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import edu.brown.cs.student.main.server.storage.StorageInterface;
import java.util.HashMap;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;

public class GetUserProfileHandler implements Route {

  private final StorageInterface storageHandler;

  public GetUserProfileHandler(StorageInterface storageHandler) {
    this.storageHandler = storageHandler;
  }

  @Override
  public Object handle(Request request, Response response) {
    Map<String, Object> responseMap = new HashMap<>();
    try {
      String uid = request.queryParams("uid");
      if (uid == null || uid.isEmpty()) {
        responseMap.put("response_type", "failure");
        responseMap.put("error", "Missing uid query parameter.");
        return Utils.toMoshiJson(responseMap);
      }

      Firestore db = FirestoreClient.getFirestore();
      DocumentSnapshot snapshot = db.collection("profiles").document(uid).get().get();

      if (snapshot.exists()) {
        responseMap.put("response_type", "success");
        responseMap.put("profile", snapshot.getData());
      } else {
        responseMap.put("response_type", "failure");
        responseMap.put("error", "No profile found for uid: " + uid);
      }
    } catch (Exception e) {
      e.printStackTrace();
      responseMap.put("response_type", "failure");
      responseMap.put("error", e.getMessage());
    }

    return Utils.toMoshiJson(responseMap);
  }
}
