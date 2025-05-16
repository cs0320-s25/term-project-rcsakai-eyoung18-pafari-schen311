package edu.brown.cs.student;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;

public class FirestoreTestUtil {
  public static void mockFirestoreGet(String uid, DocumentSnapshot mockSnapshot) throws Exception {
    Firestore mockFirestore = mock(Firestore.class);
    var mockCollection = mock(com.google.cloud.firestore.CollectionReference.class);
    var mockDocumentRef = mock(com.google.cloud.firestore.DocumentReference.class);
    var mockFuture = mock(ApiFuture.class);

    when(FirestoreClient.getFirestore()).thenReturn(mockFirestore);
    when(mockFirestore.collection("profiles")).thenReturn(mockCollection);
    when(mockCollection.document(uid)).thenReturn(mockDocumentRef);
    when(mockDocumentRef.get()).thenReturn(mockFuture);
    when(mockFuture.get()).thenReturn(mockSnapshot);
  }
}
