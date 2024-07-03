import { useState } from "react";
import "./Exhibitions.scss";
import "./Exhibitions.css";
import DataTable from "../../components/dataTable/DataTable";
import Add from "../../components/add/Add";
import { GridColDef } from "@mui/x-data-grid";
// import { partGeneralIds } from "../../data";
import { useQuery } from "@tanstack/react-query";

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
  {
    field: "createdAt",
    headerName: "Created At",
    width: 200,
    type: "string",
  },
];

const Exhibitions = () => {
  const [open, setOpen] = useState(false);

  const slug = {
    title: "exhibitions",
    route: "createExhibition",
    single: "exhibition",
  };
  // TEST THE API

  const { isLoading, data } = useQuery({
    queryKey: ["exhibitions"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_APP_URL}exhibitions`).then((res) =>
        res.json()
      ),
  });

  return (
    <div className="exhibitions">
      <div className="info">
        <h1>Exhibitions</h1>
        <button onClick={() => setOpen(true)}>Add New Exhibition</button>
      </div>
      {/* <DataTable slug="partGeneralIds" columns={columns} rows={partGeneralIds} /> */}
      {/* TEST THE API */}

      {isLoading ? (
        "Loading..."
      ) : (
        <DataTable
          slug={slug}
          columns={columns}
          rows={data}
          parallelDataSet="exhibitions"
          materials={undefined}
          parts={undefined}
        />
      )}
      {open && (
        <Add
          slug={slug}
          columns={columns}
          setOpen={setOpen}
          parallelDataSet="exhibitions"
          parallelDataSets=""
        />
      )}
    </div>
  );
};

export default Exhibitions;
