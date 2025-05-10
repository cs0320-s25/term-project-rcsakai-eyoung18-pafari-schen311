package edu.brown.cs.student.main.server.handlers;

import java.lang.reflect.Type;
import java.util.Map;

import net.objecthunter.exp4j.Expression;
import net.objecthunter.exp4j.ExpressionBuilder;
import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;

public class Utils {

  public static String toMoshiJson(Map<String, Object> map) {
    Moshi moshi = new Moshi.Builder().build();
    Type mapStringObject = Types.newParameterizedType(Map.class, String.class, Object.class);
    JsonAdapter<Map<String, Object>> adapter = moshi.adapter(mapStringObject);

    return adapter.toJson(map);
  }
  public static double evalMathExpression(String expr) {
    Expression expression = new ExpressionBuilder(expr).build();
    return expression.evaluate();
  }
}
