import { useState } from "react";
import "./MaterialGrades.scss";
import DataTable from "../../components/dataTable/DataTable";
import Add from "../../components/add/Add";
import { GridColDef } from "@mui/x-data-grid";
// import { materialGrades } from "../../data";
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
    field: "materialnames",
    headerName: "materialnames",
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

const MaterialGrades = () => {
  const [open, setOpen] = useState(false);

  const slug = {
    title: "materialGrades",
    route: "createMaterialGrade",
    single: "materialGrade",
  };
  // TEST THE API

  const { isLoading, data } = useQuery({
    queryKey: ["materialGrades"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_APP_URL}materialGrades`).then((res) =>
        res.json()
      ),
  });

  return (
    <div className="materialGrades">
      <div className="info">
        <h1>MaterialGrades</h1>
        <button onClick={() => setOpen(true)}>Add New MaterialGrade</button>
      </div>
      {/* <DataTable slug="materialGrades" columns={columns} rows={materialGrades} /> */}
      {/* TEST THE API */}

      {isLoading ? (
        "Loading..."
      ) : (
        <DataTable
          slug={slug}
          columns={columns}
          rows={data}
          parallelDataSet="materialnames"
        />
      )}
      {open && (
        <Add
          slug={slug}
          columns={columns}
          setOpen={setOpen}
          parallelDataSet="materialnames"
          parallelDataSets=""
        />
      )}
    </div>
  );
};

export default MaterialGrades;
