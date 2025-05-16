package edu.brown.cs.student.main.server.handlers;

import com.google.cloud.firestore.DocumentSnapshot;
import com.google.firebase.cloud.FirestoreClient;
import edu.brown.cs.student.main.server.storage.StorageInterface;
import java.util.HashMap;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;

public class SearchDailyHandler implements Route {
  public SearchDailyHandler(StorageInterface firebaseUtils) {
    // TODO Auto-generated constructor stub
  }

  @Override
  public Object handle(Request request, Response response) {
    Map<String, Object> responseMap = new HashMap<>();

    try {
      String uid = request.queryParams("uid");
      String date = request.queryParams("date");
      if (uid == null || date == null) {
        throw new IllegalArgumentException("Missing uid or date.");
      }

      String docId = "profile-" + uid;
      DocumentSnapshot snapshot =
          FirestoreClient.getFirestore()
              .collection("profiles")
              .document(docId)
              .collection("daily_logs")
              .document(date)
              .get()
              .get();

      if (!snapshot.exists()) {
        responseMap.put("response_type", "failure");
        responseMap.put("error", "No entry found for this date.");
      } else {
        responseMap.put("response_type", "success");
        responseMap.put("data", snapshot.getData());
      }
    } catch (Exception e) {
      responseMap.put("response_type", "failure");
      responseMap.put("error", e.getMessage());
    }

    return Utils.toMoshiJson(responseMap);
  }
}
