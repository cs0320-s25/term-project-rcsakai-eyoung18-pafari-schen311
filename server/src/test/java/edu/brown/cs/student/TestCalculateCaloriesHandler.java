package edu.brown.cs.student;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.google.cloud.firestore.DocumentSnapshot;
import edu.brown.cs.student.main.server.handlers.CalculateCaloriesHandler;
import edu.brown.cs.student.main.server.handlers.CalorieEquationEntry;
import edu.brown.cs.student.main.server.storage.StorageInterface;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import org.json.JSONObject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import spark.Request;
import spark.Response;

public class TestCalculateCaloriesHandler {

  private StorageInterface mockStorage;
  private Request mockRequest;
  private Response mockResponse;
  private DocumentSnapshot mockSnapshot;
  private CalculateCaloriesHandler handler;

  @BeforeEach
  public void setup() throws Exception {
    mockStorage = mock(StorageInterface.class);
    mockRequest = mock(Request.class);
    mockResponse = mock(Response.class);
    mockSnapshot = mock(DocumentSnapshot.class);

    handler = new CalculateCaloriesHandler(mockStorage) {
      {
        // Inject a simple equation table directly
        this.equationTable.clear();
        this.equationTable.add(new CalorieEquationEntry(
            "Female", "19 years and above", "Active",
            "TEE = 710.25 – (7.01 × age) + (6.54 × height) + (12.34 × weight)"));
      }
    };
  }

  @Test
  public void testSuccessfulCalculation() throws Exception {
    when(mockRequest.queryParams("uid")).thenReturn("user123");

    when(mockSnapshot.exists()).thenReturn(true);
    when(mockSnapshot.get("age")).thenReturn(25);
    when(mockSnapshot.get("updatedHeight")).thenReturn(165.1);
    when(mockSnapshot.get("updatedWeight")).thenReturn(68.0388);
    when(mockSnapshot.get("sex")).thenReturn("Female");
    when(mockSnapshot.get("ageGroup")).thenReturn("19 years and above");
    when(mockSnapshot.get("activityLevel")).thenReturn("Active");

    when(mockStorage.getUserProfile("user123")).thenReturn(mockSnapshot);

    Object result = handler.handle(mockRequest, mockResponse);
    JSONObject json = new JSONObject(result.toString());

    assertEquals("success", json.getString("response_type"));
    assertTrue(json.has("calories"));
    assertTrue(json.has("protein"));
    assertTrue(json.has("carbs"));
    assertTrue(json.has("sugar"));
  }

  @Test
  public void testMissingUID() {
    when(mockRequest.queryParams("uid")).thenReturn(null);

    Object result = handler.handle(mockRequest, mockResponse);
    JSONObject json = new JSONObject(result.toString());

    assertEquals("failure", json.getString("response_type"));
    assertEquals("Missing uid query parameter.", json.getString("error"));
  }

  @Test
  public void testIncompleteProfileData() throws Exception {
    when(mockRequest.queryParams("uid")).thenReturn("user123");
    when(mockSnapshot.exists()).thenReturn(true);
    when(mockSnapshot.get("age")).thenReturn(null);

    when(mockStorage.getUserProfile("user123")).thenReturn(mockSnapshot);

    Object result = handler.handle(mockRequest, mockResponse);
    JSONObject json = new JSONObject(result.toString());

    assertEquals("failure", json.getString("response_type"));
    assertEquals("Missing required profile fields.", json.getString("error"));
  }

  @Test
  public void testNoMatchingEquation() throws Exception {
    when(mockRequest.queryParams("uid")).thenReturn("user123");

    when(mockSnapshot.exists()).thenReturn(true);
    when(mockSnapshot.get("age")).thenReturn(25);
    when(mockSnapshot.get("updatedHeight")).thenReturn(165.0);
    when(mockSnapshot.get("updatedWeight")).thenReturn(68.0);
    when(mockSnapshot.get("sex")).thenReturn("Male");
    when(mockSnapshot.get("ageGroup")).thenReturn("19 years and above");
    when(mockSnapshot.get("activityLevel")).thenReturn("Active");

    when(mockStorage.getUserProfile("user123")).thenReturn(mockSnapshot);

    Object result = handler.handle(mockRequest, mockResponse);
    JSONObject json = new JSONObject(result.toString());

    assertEquals("failure", json.getString("response_type"));
    assertEquals("No matching equation found for user parameters.", json.getString("error"));
  }
}
