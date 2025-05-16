package edu.brown.cs.student;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

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

public class TestAddDailyNutrientsHandler {

  private StorageInterface mockStorage;
  private Request mockRequest;
  private Response mockResponse;
  private AddDailyNutrientsHandler handler;

  @BeforeEach
  public void setup() {
    mockStorage = mock(StorageInterface.class);
    mockRequest = mock(Request.class);
    mockResponse = mock(Response.class);
    handler = new AddDailyNutrientsHandler(mockStorage);
  }

  @Test
  public void testSuccess() throws Exception {
    when(mockRequest.queryParams("uid")).thenReturn("user123");
    when(mockRequest.queryParams("date")).thenReturn("2025-05-16");
    when(mockRequest.queryParams("calories")).thenReturn("2000");
    when(mockRequest.queryParams("sugar")).thenReturn("30");
    when(mockRequest.queryParams("carbs")).thenReturn("900");
    when(mockRequest.queryParams("protein")).thenReturn("50");

    Object result = handler.handle(mockRequest, mockResponse);

    Map<String, Object> dailyNutrients = new HashMap<>();
    dailyNutrients.put("user-id", "user123");
    dailyNutrients.put("Calories", "2000");
    dailyNutrients.put("Sugar", "30");
    dailyNutrients.put("Carbs", "900");
    dailyNutrients.put("Protein", "50");
    dailyNutrients.put("date", "2025-05-16");

    verify(mockStorage).addDaily("profiles", "profile-user123", "daily_logs", "2025-05-16", dailyNutrients);
    JSONObject json = new JSONObject(result.toString());
    assertEquals("success", json.getString("response_type"));
  }

  @Test
  public void testMissingUid() throws Exception {
    when(mockRequest.queryParams("uid")).thenReturn(null);
    when(mockRequest.queryParams("date")).thenReturn("2025-05-16");

    Object result = handler.handle(mockRequest, mockResponse);

    verify(mockResponse).status(400);
    JSONObject json = new JSONObject(result.toString());
    assertEquals("error", json.getString("response_type"));
    assertEquals("Missing uid or date", json.getString("error"));
  }

  @Test
  public void testStorageFailure() throws Exception {
    when(mockRequest.queryParams("uid")).thenReturn("user123");
    when(mockRequest.queryParams("date")).thenReturn("2025-05-16");
    when(mockRequest.queryParams("calories")).thenReturn("2000");
    when(mockRequest.queryParams("sugar")).thenReturn("30");
    when(mockRequest.queryParams("carbs")).thenReturn("250");
    when(mockRequest.queryParams("protein")).thenReturn("100");

    doThrow(new RuntimeException("Firestore error"))
        .when(mockStorage).addDaily(any(), any(), any(), any(), any());

    Object result = handler.handle(mockRequest, mockResponse);

    verify(mockResponse).status(500);
    JSONObject json = new JSONObject(result.toString());
    assertEquals("error", json.getString("response_type"));
  }
}
