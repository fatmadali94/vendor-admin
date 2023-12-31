import { useState } from "react";
import "./PartGeneralIds.scss";
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
    field: "partnames",
    headerName: "partnames",
    width: 150,
    type: "options",
  },
  // {
  //   field: "partproviders",
  //   headerName: "partproviders",
  //   width: 150,
  //   type: "options",
  // },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 200,
    type: "string",
  },
];

const PartGeneralIds = () => {
  const [open, setOpen] = useState(false);

  const slug = {
    title: "partsGeneralIds",
    route: "createPartGeneralId",
    single: "partGeneralId",
  };
  // TEST THE API

  const { isLoading, data } = useQuery({
    queryKey: ["partsGeneralIds"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_APP_URL}partsGeneralIds`).then((res) =>
        res.json()
      ),
  });

  return (
    <div className="partGeneralIds">
      <div className="info">
        <h1>PartGeneralIds</h1>
        <button onClick={() => setOpen(true)}>Add New PartGeneralId</button>
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
          parallelDataSet="partnames"
        />
      )}
      {open && (
        <Add
          slug={slug}
          columns={columns}
          setOpen={setOpen}
          parallelDataSet="partnames"
          parallelDataSets=""
        />
      )}
    </div>
  );
};

export default PartGeneralIds;
