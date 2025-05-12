import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";

export interface DailyEntry {
  date: string;
  "user-id": string;
  Calories: string;
  Sugar: string;
  Carbs: string;
  Protein: string;
}

export function useDailyData() {
  const [dailyData, setDailyData] = useState<Record<string, DailyEntry>>({});
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return;

      const res = await fetch(`http://localhost:3232/get-daily?uid=${user.id}`);
      const json = await res.json();

      if (json.response_type === "success") {
        setDailyData(json.data);
      } else {
        console.error("Failed to fetch daily data:", json.error);
      }

      setLoading(false);
    }

    fetchData();
  }, [user]);

  return { dailyData, loading };
}
