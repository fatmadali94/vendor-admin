import { useState } from "react";
import "./affiliates.css";
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
];

const Affiliates = () => {
  const [open, setOpen] = useState(false);
  const slug = {
    title: "affiliates",
    route: "createAffiliate",
    single: "affiliate",
  };

  // const [file, setFile] = useState();
  // const [title, setTitle] = useState("");

  // const submit = async (e: { preventDefault: () => void }) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   formData.append("image", file);
  //   formData.append("title", title);

  //   const result = await axios.post(
  //     "http://localhost:8080/createCategory",
  //     formData,
  //     {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     }
  //   );
  // };

  // TEST THE API

  const { isLoading, data } = useQuery({
    queryKey: ["affiliates"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_APP_URL}affiliates`).then((res) =>
        res.json()
      ),
  });

  return (
    <div className="affiliates">
      <div className="info">
        <h1>Affiliates</h1>
        <button onClick={() => setOpen(true)}>Add New Affiliate</button>
      </div>
      {/* <DataTable slug="categories" columns={columns} rows={categories} /> */}
      {/* TEST THE API */}

      {isLoading ? (
        "Loading..."
      ) : (
        <DataTable
          slug={slug}
          columns={columns}
          rows={data}
          parallelDataSet=""
        />
      )}
      {open && (
        <Add
          slug={slug}
          columns={columns}
          setOpen={setOpen}
          parallelDataSet=""
        />
      )}
    </div>
  );
};

export default Affiliates;
