import { useState } from "react";
import "./MaterialNames.scss";
import DataTable from "../../components/dataTable/DataTable";
import Add from "../../components/add/Add";
import { GridColDef } from "@mui/x-data-grid";
// import { materialNames } from "../../data";
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
    field: "materialgroups",
    headerName: "materialgroups",
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

const MaterialNames = () => {
  const [open, setOpen] = useState(false);

  const slug = {
    title: "materialNames",
    route: "createMaterialName",
    single: "materialName",
  };
  // TEST THE API

  const { isLoading, data } = useQuery({
    queryKey: ["materialNames"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_APP_URL}materialNames`).then((res) =>
        res.json()
      ),
  });
  console.log(data, "this is material names");

  return (
    <div className="materialNames">
      <div className="info">
        <h1>MaterialNames</h1>
        <button onClick={() => setOpen(true)}>Add New MaterialName</button>
      </div>
      {/* <DataTable slug="materialNames" columns={columns} rows={materialNames} /> */}
      {/* TEST THE API */}

      {isLoading ? (
        "Loading..."
      ) : (
        <DataTable
          slug={slug}
          columns={columns}
          rows={data}
          parallelDataSet="materialGroups"
        />
      )}
      {open && (
        <Add
          slug={slug}
          columns={columns}
          setOpen={setOpen}
          parallelDataSet="materialGroups"
          parallelDataSets=""
        />
      )}
    </div>
  );
};

export default MaterialNames;
