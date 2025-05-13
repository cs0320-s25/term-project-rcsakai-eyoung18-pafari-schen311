package edu.brown.cs.student.main.server.handlers;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.cloud.FirestoreClient;
import edu.brown.cs.student.main.server.storage.StorageInterface;
import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;
import spark.Request;
import spark.Response;
import spark.Route;

public class GetDailyNutrientsHandler implements Route {

  private final StorageInterface storageHandler;

  public GetDailyNutrientsHandler(StorageInterface storageHandler) {
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
      String userPath = "profiles/profile-" + uid + "/daily_logs";
      CollectionReference dailyLogsRef = db.collection(userPath);
      ApiFuture<QuerySnapshot> future = dailyLogsRef.get();
      QuerySnapshot snapshots = future.get();

      if (snapshots.isEmpty()) {
        responseMap.put("response_type", "failure");
        responseMap.put("error", "No daily logs found for uid: " + uid);
        return Utils.toMoshiJson(responseMap);
      }

      Map<String, Map<String, Object>> logsByDate = new TreeMap<>();

      for (DocumentSnapshot doc : snapshots.getDocuments()) {
        logsByDate.put(doc.getId(), doc.getData());
      }

      responseMap.put("response_type", "success");
      responseMap.put("data", logsByDate);
    } catch (Exception e) {
      e.printStackTrace();
      responseMap.put("response_type", "failure");
      responseMap.put("error", e.getMessage());
    }

    return Utils.toMoshiJson(responseMap);
  }
}
