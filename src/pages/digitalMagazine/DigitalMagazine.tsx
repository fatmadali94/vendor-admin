import { useState } from "react";
import "./DigitalMagazine.scss";
import DataTable from "../../components/dataTable/DataTable";
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import AddDigitalMagazine from "../../components/add/AddDigitalMagazine";

interface DigitalMagazineData {
  id: string;
  image?: { url?: string };
  description: string;
  title: string;
  pdf?: { url?: string };
  year: string;
  month: string;
  number: string;
  topics: { topic: string; page: number }[]; // ✅ Fixed topics type
  pages: number[]; // ✅ Added pages field
  advertisements: { url: string }[];
  editorial: { name: string; text: string; images: { url: string } };
  collectors: { name: string; images: { url: string }[] }[];
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
        alt="Magazine Cover"
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
  {
    field: "topics",
    headerName: "Topics",
    width: 250,
    renderCell: (params) => (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
        {params.row.topics?.map((t: { topic: string; page: number }, index: number) => (
          <span
            key={index}
            style={{
              backgroundColor: "#f0f0f0",
              padding: "5px",
              borderRadius: "5px",
              fontSize: "12px",
              whiteSpace: "nowrap",
            }}
          >
            {t.topic} (p. {t.page})
          </span>
        ))}
      </div>
    ),
  },
  {
    field: "pages",
    headerName: "Pages",
    width: 150,
    renderCell: (params) => (
      <span>
        {params.row.pages?.length ? params.row.pages.join(", ") : "N/A"}
      </span>
    ),
  },
];

const DigitalMagazine = () => {
  const [open, setOpen] = useState(false);

  const slug = {
    title: "DigitalMagazine",
    route: "createDigitalMagazine",
    single: "DigitalMagazine",
  };

  const { isLoading, error, data } = useQuery<DigitalMagazineData[]>({
    queryKey: ["DigitalMagazine"],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_APP_URL}/api/digitalMagazines`);
      if (!response.ok) throw new Error("Failed to fetch magazines");
      return response.json();
    },
  });

  return (
    <div className="DigitalMagazine">
      <div className="info">
        <h1>Digital Magazine</h1>
        <button onClick={() => setOpen(true)}>Add Magazine</button>
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
          parallelDataSet="DigitalMagazine"
          materials={undefined}
          parts={undefined}
        />
      )}

      {open && (
        <AddDigitalMagazine
          setOpen={setOpen}
          slug={{ title: "DigitalMagazine", route: "/api/digitalMagazines" }}
          columns={[
            { field: "title", headerName: "Title", type: "text" },
            { field: "description", headerName: "Description", type: "text" },
            { field: "year", headerName: "Year", type: "text" },
            { field: "month", headerName: "Month", type: "text" },
            { field: "number", headerName: "Number", type: "text" },
          ]}
        />
      )}
    </div>
  );
};

export default DigitalMagazine;
