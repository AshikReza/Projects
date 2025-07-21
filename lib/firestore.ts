// src/lib/firestore.ts

import { doc, setDoc, onSnapshot, DocumentData } from "firebase/firestore";
import { db } from "./firebase";
import { Habit, DailyProgress } from "@/app/page"; // Adjust path if needed

// --- Type for our User Data ---
export interface UserData {
  habits: Habit[];
  progress: DailyProgress;
}

// --- Function to SAVE User Data (This remains mostly the same) ---
// We will call this whenever habits or progress change locally.
export const saveUserData = async (
  userId: string,
  data: Partial<UserData> // Use Partial to allow saving just habits or just progress
): Promise<void> => {
  try {
    const userDocRef = doc(db, "users", userId);
    // Use { merge: true } so you don't overwrite habits when updating progress, and vice-versa.
    await setDoc(userDocRef, data, { merge: true });
  } catch (error) {
    console.error("Error saving user data:", error);
    throw new Error("Could not save user data.");
  }
};

// --- Function to STREAM User Data (This is the key change) ---
// This sets up a real-time listener.
export const streamUserData = (
  userId: string,
  onData: (data: UserData) => void,
  onError: (error: Error) => void
) => {
  const userDocRef = doc(db, "users", userId);

  const unsubscribe = onSnapshot(
    userDocRef,
    (docSnap) => {
      if (docSnap.exists()) {
        // If the document exists, pass its data to our callback.
        onData(docSnap.data() as UserData);
      } else {
        // If the document doesn't exist, provide a default structure.
        // This handles new users gracefully.
        onData({ habits: [], progress: {} });
      }
    },
    (error) => {
      // If there's an error (like permission-denied), pass it to the error callback.
      console.error("Snapshot listener error:", error);
      onError(error);
    }
  );

  // Return the unsubscribe function so the component can clean up the listener.
  return unsubscribe;
};
