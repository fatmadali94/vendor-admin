import { useState } from "react";
import "./PartNames.scss";
import DataTable from "../../components/dataTable/DataTable";
import Add from "../../components/add/Add";
import { GridColDef } from "@mui/x-data-grid";
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
    field: "description",
    headerName: "Description",
    type: "text",
    width: 200,
  },
  {
    field: "title",
    headerName: "title",
    type: "text",
    width: 200,
  },
  {
    field: "BTN",
    headerName: "BTN",
    width: 150,
    type: "button",
  },
  {
    field: "partGeneralIds",
    headerName: "partGeneralIds",
    width: 150,
    type: "options",
  },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 200,
    type: "string",
  },
];

const partNames = () => {
  const [open, setOpen] = useState(false);

  const slug = {
    title: "partNames",
    route: "createPartName",
    single: "partName",
  };
  // TEST THE API

  const { isLoading, data } = useQuery({
    queryKey: ["partNames"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_APP_URL}partNames`).then((res) =>
        res.json()
      ),
  });

  return (
    <div className="partNames">
      <div className="info">
        <h1>partNames</h1>
        <button onClick={() => setOpen(true)}>Add New PartName</button>
      </div>
      {/* <DataTable slug="partNames" columns={columns} rows={partNames} /> */}
      {/* TEST THE API */}

      {isLoading ? (
        "Loading..."
      ) : (
        <DataTable
          slug={slug}
          columns={columns}
          rows={data}
          parallelDataSet="partGeneralIds"
          materials={undefined}
          parts={undefined}
        />
      )}
      {open && (
        <Add
          slug={slug}
          columns={columns}
          setOpen={setOpen}
          parallelDataSet="partgroups"
          parallelDataSets=""
        />
      )}
    </div>
  );
};

export default partNames;
