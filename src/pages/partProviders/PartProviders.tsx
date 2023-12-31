import { useState } from "react";
import "./PartProviders.scss";
import DataTable from "../../components/dataTable/DataTable";
import Add from "../../components/add/Add";
import { GridColDef } from "@mui/x-data-grid";
// import { partProviders } from "../../data";
import { useQuery } from "@tanstack/react-query";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "image",
    headerName: "Image",
    width: 100,
    renderCell: (params) => {
      return <img src={params.row.image?.url || "/noavatar.png"} alt="img" />;
    },
  },
  {
    field: "name",
    type: "text",
    headerName: "Name",
    width: 250,
  },

  {
    field: "link",
    headerName: "Link",
    width: 150,
    type: "text",
  },
  {
    field: "email",
    headerName: "Email",
    width: 150,
    type: "text",
  },
  {
    field: "lat",
    headerName: "Lat",
    width: 150,
    type: "number",
  },
  {
    field: "lng",
    headerName: "Lng",
    width: 150,
    type: "number",
  },
  {
    field: "description",
    headerName: "Description",
    width: 150,
    type: "text",
  },
  {
    field: "phone",
    headerName: "Phone",
    width: 150,
    type: "number",
  },
  {
    field: "partgeneralids",
    headerName: "partsGeneralIds",
    width: 150,
    type: "options",
  },
  {
    field: "partnames",
    headerName: "partNames",
    width: 150,
    type: "options",
  },
  {
    field: "partgroups",
    headerName: "partGroups",
    width: 150,
    type: "options",
  },
];

const PartProviders = () => {
  const [open, setOpen] = useState(false);

  const slug = {
    title: "partProviders",
    route: "createPartProvider",
    single: "partProvider",
  };
  const parallelDataSets: any = [
    {
      title: "partGroups",
    },
    {
      title: "partNames",
    },
    {
      title: "partsGeneralIds",
    },
  ];
  // TEST THE API

  const { isLoading, data } = useQuery({
    queryKey: ["partProviders"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_APP_URL}partProviders`).then((res) =>
        res.json()
      ),
  });

  return (
    <div className="partProviders">
      <div className="info">
        <h1>PartProviders</h1>
        <button onClick={() => setOpen(true)}>Add New PartProvider</button>
      </div>
      {/* <DataTable slug="partProviders" columns={columns} rows={partProviders} /> */}
      {/* TEST THE API */}

      {isLoading ? (
        "Loading..."
      ) : (
        <DataTable
          slug={slug}
          columns={columns}
          rows={data}
          parallelDataSet="partgeneralids"
        />
      )}
      {open && (
        <Add
          slug={slug}
          columns={columns}
          setOpen={setOpen}
          parallelDataSet=""
          parallelDataSets={parallelDataSets}
        />
      )}
    </div>
  );
};

export default PartProviders;
