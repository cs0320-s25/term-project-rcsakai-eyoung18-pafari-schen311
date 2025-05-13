package edu.brown.cs.student.main.server;

import static spark.Spark.after;

import edu.brown.cs.student.main.server.handlers.AddDailyNutrientsHandler;
import edu.brown.cs.student.main.server.handlers.AddUserProfileHandler;
import edu.brown.cs.student.main.server.handlers.CalculateCaloriesHandler;
import edu.brown.cs.student.main.server.handlers.ClearUserHandler;
import edu.brown.cs.student.main.server.handlers.GetDailyNutrientsHandler;
import edu.brown.cs.student.main.server.handlers.GetUserProfileHandler;
import edu.brown.cs.student.main.server.handlers.LoadCSVHandler;
import edu.brown.cs.student.main.server.handlers.SearchDailyHandler;
import edu.brown.cs.student.main.server.storage.FirebaseUtilities;
import edu.brown.cs.student.main.server.storage.StorageInterface;
import java.io.IOException;
import spark.Filter;
import spark.Spark;

/** Top Level class for our project, utilizes spark to create and maintain our server. */
public class Server {

  public static void setUpServer() {
    int port = 3232;
    Spark.port(port);

    after(
        (Filter)
            (request, response) -> {
              response.header("Access-Control-Allow-Origin", "*");
              response.header("Access-Control-Allow-Methods", "*");
            });

    StorageInterface firebaseUtils;
    try {
      firebaseUtils = new FirebaseUtilities();

      Spark.get("clear-user", new ClearUserHandler(firebaseUtils));
      Spark.get("add-user-profile", new AddUserProfileHandler(firebaseUtils));
      Spark.get("get-user-profile", new GetUserProfileHandler(firebaseUtils));
      Spark.get("add-daily", new AddDailyNutrientsHandler(firebaseUtils));
      Spark.get("get-daily", new GetDailyNutrientsHandler(firebaseUtils));
      Spark.get("get-calories", new CalculateCaloriesHandler(firebaseUtils));
      Spark.get("search-daily", new SearchDailyHandler(firebaseUtils));
      Spark.get("load-csv", new LoadCSVHandler());

      Spark.notFound(
          (request, response) -> {
            response.status(404); // Not Found
            System.out.println("ERROR: unknown path " + request.pathInfo());
            return "404 Not Found - The requested endpoint does not exist.";
          });
      Spark.init();
      Spark.awaitInitialization();

      System.out.println("Server started at http://localhost:" + port);
    } catch (IOException e) {
      e.printStackTrace();
      System.err.println(
          "Error: Could not initialize Firebase. Likely due to firebase_config.json not being found. Exiting.");
      System.exit(1);
    }
  }

  /**
   * Runs Server.
   *
   * @param args none
   */
  public static void main(String[] args) {
    setUpServer();
  }
}
