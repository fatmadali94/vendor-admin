import { useState } from "react";
import "./Exhibitions.scss";
import "./Exhibitions.css";
import DataTable from "../../components/dataTable/DataTable";
import AddExhibition from "../../components/add/AddExhibition";
import { GridColDef } from "@mui/x-data-grid";
// import { partGeneralIds } from "../../data";
import { useQuery } from "@tanstack/react-query";




interface ExhibitionData {
    title: "",
    description: "",
    image: "",
    category: "",
    features: "",
    specifications: "", // optional, for future expansion
    useCases: "",
    targetMarket: "",
    certifications: "",
    patents: "",
    researchPartner: "",
    videoUrl: "",
    link: "",
    company: {
      name: "",
      logo: "",
      website: "",
      location: "",
      foundedYear: "",
      background: "",
    },
    quote: {
      by: "",
      text: "",
    },
    achievements: "",
  }
  const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "image",
    headerName: "Image",
    width: 100,
    renderCell: (params) => {
      return <img src={params.row.image?.url || "/noavatar.png"} alt="" />;
    },
  },

  {
    field: "title",
    type: "text",
    headerName: "title",
    width: 150,
  },

  {
    field: "description",
    headerName: "Description",
    type: "text",
    width: 200,
  },

];


  const Exhibitions = () => {
    const [open, setOpen] = useState(false);
  
    const slug = {
  title: "exhibitions",
  route: "/createExhibition",
  single: "exhibition",
};


  
    const { isLoading, error, data } = useQuery<ExhibitionData[]>({
        queryKey: ["exhibitions"],
        queryFn: async () => {
          const response = await fetch(`${import.meta.env.VITE_APP_URL}/exhibitions`);
          if (!response.ok) throw new Error("Failed to fetch exhibitions");
          return response.json();
        },
      });
      


    return (
        <div className="exhibitions">
          <div className="info">
            <h1>Exhibitions</h1>
<button onClick={() => setOpen(true)}>Add Exhibition</button>

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
              parallelDataSet="exhibitions"
              materials={undefined}
              parts={undefined}
            />
          )}
    
          {open && (
  <AddExhibition
    setOpen={setOpen}
    slug={slug}
    columns={columns}
  />
)}

        </div>
      );
    };

export default Exhibitions;