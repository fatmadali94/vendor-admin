import { useState } from "react";
import "./MaterialProviders.scss";
import DataTable from "../../components/dataTable/DataTable";
import { GridColDef } from "@mui/x-data-grid";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import AddProviders from "../../components/add/AddProviders";
import axios from "axios";
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
    width: 150,
  },
  {
    field: "phone",
    headerName: "Phone",
    width: 150,
    type: "number",
  },
  {
    field: "link",
    headerName: "Link",
    width: 150,
    type: "text",
  },
  {
    field: "description",
    headerName: "Description",
    width: 150,
    type: "text",
  },
  {
    field: "address",
    headerName: "Address",
    width: 150,
    type: "text",
  },
  {
    field: "email",
    headerName: "Email",
    width: 150,
    type: "email",
  },
  {
    field: "export_destination",
    type: "text",
    headerName: "export_destination",
    width: 150,
  },

  {
    field: "production_type",
    type: "dropdown",
    headerName: "production_type",
    width: 150,
  },

  {
    field: "score",
    headerName: "score",
    width: 150,
    type: "number",
  },
  {
    field: "establish_year",
    headerName: "establish_year",
    width: 150,
    type: "number",
  },
  {
    field: "production_volume",
    headerName: "production_volume",
    width: 150,
    type: "number",
  },
  {
    field: "cooperation_length",
    headerName: "cooperation_length",
    width: 150,
    type: "number",
  },
  {
    field: "has_export",
    type: "checkbox",
    headerName: "has_export",
    width: 150,
  },
  {
    field: "knowledge_based",
    type: "checkbox",
    headerName: "knowledge_based",
    width: 150,
  },

  {
    field: "materialgrades",
    headerName: "materialGrades",
    width: 200,
    type: "options",
  },
  {
    field: "materialnames",
    headerName: "materialNames",
    width: 200,
    type: "options",
  },
  {
    field: "materialgroups",
    headerName: "materialGroups",
    width: 200,
    type: "options",
  },
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
  const parallelDataSetsHandler = async () => {
    try {
      const res = await Promise.all([
        axios.get(`${import.meta.env.VITE_APP_URL}/materialGroups`),
        axios.get(`${import.meta.env.VITE_APP_URL}/materialNames`),
        axios.get(`${import.meta.env.VITE_APP_URL}/materialGrades`),
      ]);
      const data = res.map((res) => res.data);
      return data;
    } catch {
      throw Error("Promise failed");
    }
  };

  if (parallelDataSets !== "") {
    var { data: materials } = useQuery({
      queryKey: ["getParallel"],
      queryFn: () => parallelDataSetsHandler(),
    });
  }

  const { isLoading, data } = useQuery({
    queryKey: ["materialProviders"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_APP_URL}materialProviders`).then((res) =>
        res.json()
      ),
  });
  console.log(data, "Data");

  return (
    <div className="materialProviders">
      <div className="info">
        <h1>MaterialProviders</h1>
        <button onClick={() => setOpen(true)}>Add New MaterialProvider</button>
      </div>

      {isLoading ? (
        "Loading..."
      ) : (
        <DataTable
          slug={slug}
          columns={columns}
          rows={data}
          parallelDataSet="materialgrades"
          materials={materials}
        />
      )}
      {open && (
        <AddProviders
          slug={slug}
          columns={columns}
          setOpen={setOpen}
          parallelDataSets={parallelDataSets}
          materials={materials}
        />
      )}
    </div>
  );
};

export default MaterialProviders;
