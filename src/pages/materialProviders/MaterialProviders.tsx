import { useState } from "react";
import "./MaterialProviders.scss";
import DataTable from "../../components/dataTable/DataTable";
// import Add from "../../components/add/Add";
import { GridColDef } from "@mui/x-data-grid";
// import { materialProviders } from "../../data";
import { useQuery } from "@tanstack/react-query";
import AddProviders from "../../components/add/AddProviders";

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
    field: "materialgrades",
    headerName: "materialGrades",
    width: 150,
    type: "options",
  },
  {
    field: "materialnames",
    headerName: "materialNames",
    width: 150,
    type: "options",
  },
  {
    field: "materialgroups",
    headerName: "materialGroups",
    width: 150,
    type: "options",
  },
  // {
  //   field: "material",
  //   headerName: "material",
  //   width: 150,
  //   type: "dropdown",
  // },
  {
    field: "BTN",
    headerName: "BTN",
    width: 150,
    type: "button",
  },
  {
    field: "Record",
    headerName: "Record",
    width: 150,
    type: "record",
  },
];

const MaterialProviders = () => {
  const [open, setOpen] = useState(false);

  const slug = {
    title: "materialProviders",
    route: "createMaterialProvider",
    single: "materialProvider",
  };
  const parallelDataSets: any = [
    {
      title: "materialGroups",
    },
    {
      title: "materialNames",
    },
    {
      title: "materialGrades",
    },
  ];
  // const tableParallelDataSets = [
  //   { title: "materialgrades" },
  //   { title: "materialgroups" },
  //   { title: "materialnames" },
  // ];
  // TEST THE API

  const { isLoading, data } = useQuery({
    queryKey: ["materialProviders"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_APP_URL}materialProviders`).then((res) =>
        res.json()
      ),
  });

  return (
    <div className="materialProviders">
      <div className="info">
        <h1>MaterialProviders</h1>
        <button onClick={() => setOpen(true)}>Add New MaterialProvider</button>
      </div>
      {/* <DataTable slug="materialProviders" columns={columns} rows={materialProviders} /> */}
      {/* TEST THE API */}

      {isLoading ? (
        "Loading..."
      ) : (
        <DataTable
          slug={slug}
          columns={columns}
          rows={data}
          parallelDataSet="materialgrades"
          // parallelDataSets={tableParallelDataSets}
        />
      )}
      {open && (
        <AddProviders
          slug={slug}
          columns={columns}
          setOpen={setOpen}
          parallelDataSets={parallelDataSets}
        />
      )}
    </div>
  );
};

export default MaterialProviders;
