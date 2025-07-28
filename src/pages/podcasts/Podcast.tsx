import { useState } from "react";
import "./Podcast.scss";
import DataTable from "../../components/dataTable/DataTable";
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import AddPodcast from "../../components/add/AddPodcast";

interface PodcastData {
    id : string;
    image?: { url?: string };
    description: string;
    title: string;
    audioFile?: { url?: string };
    year: number;
    month: string;
    number: number;
    duration: string;
    topics: { topic: string }[];
    sponsors: { name: string; images: { url: string }[] }[];
    narrator: { name: string; images: { url: string }[] }[];
  }
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "image",
      headerName: "Image",
      width: 100,
      renderCell: (params) => (
        <img
          src={params.row.image?.url ?? "/noavatar.png"}
          alt="podcast Cover"
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
      ),
    },
    {
      field: "title",
      headerName: "Title",
      type: "string",
      width: 200,
    },
    {
      field: "year",
      headerName: "Year",
      type: "text",
      width: 100,
    },
    {
      field: "month",
      headerName: "Month",
      type: "string",
      width: 100,
    },
    {
      field: "number",
      headerName: "Number",
      type: "string",
      width: 100,
    },
  ];


  const Podcast = () => {
    const [open, setOpen] = useState(false);
  
    const slug = {
      title: "podcast",
      route: "createPodcast",
      single: "Podcast",
    };
  
    const { isLoading, error, data } = useQuery<PodcastData[]>({
        queryKey: ["Podcast"],
        queryFn: async () => {
          const response = await fetch(`${import.meta.env.VITE_APP_URL}/api/podcasts`);
          if (!response.ok) throw new Error("Failed to fetch magazines");
          return response.json();
        },
      });
      


    return (
        <div className="Podcast">
          <div className="info">
            <h1>Podcast</h1>
            <button onClick={() => setOpen(true)}>Add Podcast</button>
          </div>
    
          {isLoading ? (
            "Loading..."
          ) : error ? (
            <p style={{ color: "red" }}>Error loading data</p>
          ) : (
            <DataTable
              slug={slug}
              columns={columns}
              rows={data ?? []} // Ensuring data is always an array
              parallelDataSet="Podcast"
              materials={undefined}
              parts={undefined}
            />
          )}
    
          {open && (
            <AddPodcast
              setOpen={setOpen}
              slug={{ title: "Podcast", route: "/api/podcasts" }}
              columns={[
                { field: "title", headerName: "Title", type: "text" },
                { field: "year", headerName: "Year", type: "text" },
                { field: "month", headerName: "Month", type: "text" },
                { field: "number", headerName: "Number", type: "text" },
                { field: "duration", headerName: "duration", type: "text" },
              ]}
            />
          )}
        </div>
      );
    };

    export default Podcast;