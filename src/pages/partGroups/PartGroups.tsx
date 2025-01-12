import { useState } from "react";
import "./PartGroups.scss";
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
    field: "BTN",
    headerName: "BTN",
    width: 150,
    type: "button",
  },
  {
    field: "partnames",
    headerName: "partnames",
    width: 150,
    type: "options",
  },
];

const partGroups = () => {
  const [open, setOpen] = useState(false);
  const slug = {
    title: "partGroups",
    route: "createpartGroup",
    single: "partGroup",
  };

  // const [file, setFile] = useState();
  // const [title, setTitle] = useState("");

  // const submit = async (e: { preventDefault: () => void }) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   formData.append("image", file);
  //   formData.append("title", title);

  //   const result = await axios.post(
  //     "http://localhost:8080/createpartGroup",
  //     formData,
  //     {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     }
  //   );
  // };

  // TEST THE API

  const { isLoading, data } = useQuery({
    queryKey: ["partGroups"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_APP_URL}partGroups`).then((res) =>
        res.json()
      ),
  });

  return (
    <div className="partGroups">
      <div className="info">
        <h1>partGroups</h1>
        <button onClick={() => setOpen(true)}>Add New partGroups</button>
      </div>

      {isLoading ? (
        "Loading..."
      ) : (
        <DataTable
          slug={slug}
          columns={columns}
          rows={data}
          parallelDataSet="partNames"
          materials={undefined}
          parts={undefined}
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
        <AddpartGroups
          slug={slug}
          columns={columns}
          setOpen={setOpen}
          parallelDataSet="subpartGroups"
        />
      )} */}
    </div>
  );
};

export default partGroups;
