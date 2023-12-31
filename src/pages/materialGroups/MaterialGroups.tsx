import { useState } from "react";
import "./MaterialGroups.scss";
import DataTable from "../../components/dataTable/DataTable";
import Add from "../../components/add/Add";

import { GridColDef } from "@mui/x-data-grid";
// import { materialGroups } from "../../data";
// import axios from "axios";
import { useQuery } from "@tanstack/react-query";
// import AddMaterialGroups from "../../components/addMaterialGroups/AddMaterialGroups";

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
    headerName: "Title",
    width: 250,
  },

  {
    field: "description",
    headerName: "Description",
    width: 150,
    type: "text",
  },
  {
    field: "materialnames",
    headerName: "materialnames",
    width: 150,
    type: "options",
  },
];

const MaterialGroups = () => {
  const [open, setOpen] = useState(false);
  const slug = {
    title: "materialGroups",
    route: "createMaterialGroup",
    single: "materialGroup",
  };

  // const [file, setFile] = useState();
  // const [title, setTitle] = useState("");

  // const submit = async (e: { preventDefault: () => void }) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   formData.append("image", file);
  //   formData.append("title", title);

  //   const result = await axios.post(
  //     "http://localhost:8080/createMaterialGroup",
  //     formData,
  //     {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     }
  //   );
  // };

  // TEST THE API

  const { isLoading, data } = useQuery({
    queryKey: ["materialGroups"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_APP_URL}materialGroups`).then((res) =>
        res.json()
      ),
  });
  // console.log(import.meta.env.VITE_APP_URL);
  // console.log(data, "this is materialGroups");

  return (
    <div className="materialGroups">
      <div className="info">
        <h1>MaterialGroups</h1>
        <button onClick={() => setOpen(true)}>Add New MaterialGroups</button>
      </div>
      {/* <DataTable slug="materialGroups" columns={columns} rows={materialGroups} /> */}
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
          parallelDataSet=""
          parallelDataSets=""
        />
      )}
      {/* {open && (
        <AddMaterialGroups
          slug={slug}
          columns={columns}
          setOpen={setOpen}
          parallelDataSet="subMaterialGroups"
        />
      )} */}
    </div>
  );
};

export default MaterialGroups;
