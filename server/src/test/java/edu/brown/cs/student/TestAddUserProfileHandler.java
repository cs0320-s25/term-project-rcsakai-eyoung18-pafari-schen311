package edu.brown.cs.student;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import edu.brown.cs.student.main.server.handlers.AddUserProfileHandler;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import org.json.JSONObject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import spark.Request;
import spark.Response;
import edu.brown.cs.student.main.server.handlers.AddDailyNutrientsHandler;
import edu.brown.cs.student.main.server.storage.StorageInterface;

public class TestAddUserProfileHandler {

  private StorageInterface mockStorage;
  private Request mockRequest;
  private Response mockResponse;
  private AddUserProfileHandler handler;

  @BeforeEach
  public void setup() {
    mockStorage = mock(StorageInterface.class);
    mockRequest = mock(Request.class);
    mockResponse = mock(Response.class);
    handler = new AddUserProfileHandler(mockStorage);
  }

  @Test
  public void testSuccess() throws Exception {
    when(mockRequest.queryParams("uid")).thenReturn("user123");
    when(mockRequest.queryParams("name")).thenReturn("Alice");
    when(mockRequest.queryParams("sex")).thenReturn("Female");
    when(mockRequest.queryParams("birthday")).thenReturn("2000-01-01");
    when(mockRequest.queryParams("height")).thenReturn("65");
    when(mockRequest.queryParams("weight")).thenReturn("150");
    when(mockRequest.queryParams("activityLevel")).thenReturn("Active");
    when(mockRequest.queryParams("heightUnit")).thenReturn("in");
    when(mockRequest.queryParams("weightUnit")).thenReturn("lbs");

    Object result = handler.handle(mockRequest, mockResponse);

    int currentYear = java.time.LocalDate.now().getYear();
    int expectedAge = currentYear - 2000;

    Map<String, Object> profileData = new HashMap<>();
    profileData.put("user-id", "user123");
    profileData.put("name", "Alice");
    profileData.put("sex", "Female");
    profileData.put("birthday", "2000-01-01");
    profileData.put("age", expectedAge);
    profileData.put("height", "65");
    profileData.put("updatedHeight", 165.1);
    profileData.put("weight", "150");
    profileData.put("updatedWeight", 68.0388);
    profileData.put("activityLevel", "Active");
    profileData.put("ageGroup", "19 years and above");
    profileData.put("heightUnit", "in");
    profileData.put("weightUnit", "lbs");

    verify(mockStorage).addDocument("profiles", "profile-user123", profileData);
    JSONObject json = new JSONObject(result.toString());
    assertEquals("success", json.getString("response_type"));
  }

  @Test
  public void testMissingParameter() throws Exception {
    when(mockRequest.queryParams("uid")).thenReturn(null);
    when(mockRequest.queryParams("name")).thenReturn("Alice");

    Object result = handler.handle(mockRequest, mockResponse);

    verify(mockResponse).status(400);
    JSONObject json = new JSONObject(result.toString());
    assertEquals("error", json.getString("response_type"));
    assertEquals("Missing one or more required parameters.", json.getString("error"));
  }

  @Test
  public void testStorageFailure() throws Exception {
    when(mockRequest.queryParams("uid")).thenReturn("user123");
    when(mockRequest.queryParams("name")).thenReturn("Alice");
    when(mockRequest.queryParams("sex")).thenReturn("Female");
    when(mockRequest.queryParams("birthday")).thenReturn("2000-01-01");
    when(mockRequest.queryParams("height")).thenReturn("65");
    when(mockRequest.queryParams("weight")).thenReturn("150");
    when(mockRequest.queryParams("activityLevel")).thenReturn("Active");
    when(mockRequest.queryParams("heightUnit")).thenReturn("in");
    when(mockRequest.queryParams("weightUnit")).thenReturn("lbs");

    doThrow(new RuntimeException("Firestore error"))
        .when(mockStorage).addDocument(any(), any(), any());

    Object result = handler.handle(mockRequest, mockResponse);

    verify(mockResponse).status(500);
    JSONObject json = new JSONObject(result.toString());
    assertEquals("error", json.getString("response_type"));
  }
}
