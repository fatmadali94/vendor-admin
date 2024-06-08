import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

const Messages = () => {
  const [messages, setMessages] = useState([]);

  // Simulating fetching data from an API
  const { isLoading, data } = useQuery({
    queryKey: ["messages"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_APP_URL}/messages`).then((res) =>
        res.json()
      ),
  });

  return (
    <div className="flex flex-col items-center justify-center p-5">
      <div className="max-w-md w-full">
        {!isLoading &&
          data &&
          data.map((d: any, index: any) => (
            <div key={index} className="bg-white rounded-lg p-4 mb-4 shadow">
              <p className="text-gray-800 text-lg">{d}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Messages;
