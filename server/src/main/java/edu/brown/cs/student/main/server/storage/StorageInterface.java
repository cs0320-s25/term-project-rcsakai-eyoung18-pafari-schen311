package edu.brown.cs.student.main.server.storage;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

public interface StorageInterface {

  void addDocument(String uid, String docId, Map<String, Object> data);

  void addDaily(String collectionId, String docId, String subcollection, String date, Map<String, Object> data);

  List<Map<String, Object>> getCollection(String uid)
      throws InterruptedException, ExecutionException;

  void clearUser(String uid) throws InterruptedException, ExecutionException;

  public void deleteDocument(String pins, String string);
}
