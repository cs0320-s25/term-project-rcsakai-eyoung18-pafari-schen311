package edu.brown.cs.student.main.server.handlers;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.List;
import spark.Request;
import spark.Response;
import spark.Route;

public class LoadCSVHandler implements Route {
  private final Moshi moshi;

  public LoadCSVHandler() {
    this.moshi = new Moshi.Builder().build();
  }

  @Override
  public Object handle(Request request, Response response) {
    String filePath = request.queryParams("path");
    if (filePath == null || filePath.isEmpty()) {
      return jsonError("error_bad_request: missing file path.");
    }

    if (!filePath.startsWith("datasets")) {
      return jsonError("error_bad_request: invalid path -- must be in datasets folder.");
    }

    List<CalorieEquationEntry> entries;
    try {
      entries = CSVLoaderUtil.loadCalorieEquations(filePath);
    } catch (IOException e) {
      return jsonError("error_datasource: file not found or unreadable");
    }

    Type listType = Types.newParameterizedType(List.class, CalorieEquationEntry.class);
    JsonAdapter<List<CalorieEquationEntry>> adapter = moshi.adapter(listType);
    return adapter.toJson(entries);
  }

  private String jsonError(String message) {
    return "{\"result\":\"" + message + "\"}";
  }
}
