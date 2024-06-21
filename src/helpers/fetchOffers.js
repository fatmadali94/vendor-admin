import { useQuery } from "@tanstack/react-query";

const fetchNewOffersCount = async () => {
  const response = await fetch(`${import.meta.env.VITE_APP_URL}offers`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const useNewOffersCount = () => {
  return useQuery(["newOffersCount"], fetchNewOffersCount, {
    refetchInterval: 60000, // Poll every 60 seconds
  });
};
