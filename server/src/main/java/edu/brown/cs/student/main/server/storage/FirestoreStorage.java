package edu.brown.cs.student.main.server.storage;

import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

public class FirestoreStorage implements StorageInterface{
  @Override
  public DocumentSnapshot getUserProfile(String uid) throws Exception {
    Firestore db = FirestoreClient.getFirestore();
    return db.collection("profiles").document(uid).get().get();
  }
  @Override
  public void addDocument(String uid, String docId, Map<String, Object> data) {
  }

  @Override
  public void addDaily(
      String collectionId,
      String docId,
      String subcollection,
      String date,
      Map<String, Object> data) {
  }

  @Override
  public List<Map<String, Object>> getCollection(String uid)
      throws InterruptedException, ExecutionException {
    return null;
  }

  @Override
  public void clearUser(String uid) throws InterruptedException, ExecutionException {
  }

  @Override
  public void deleteDocument(String collectionId, String docId) {
  }
}
