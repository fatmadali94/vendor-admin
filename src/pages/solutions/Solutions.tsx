import { useState } from "react";
import "./solutions.css";
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
    field: "products",
    headerName: "Products",
    width: 150,
    type: "options",
  },
];

const Solutions = () => {
  const [open, setOpen] = useState(false);
  const slug = {
    title: "solutions",
    route: "createSolution",
    single: "solution",
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
    queryKey: ["solutions"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_APP_URL}solutions`).then((res) =>
        res.json()
      ),
  });

  return (
    <div className="solutions">
      <div className="info">
        <h1>Solutions</h1>
        <button onClick={() => setOpen(true)}>Add New Solution</button>
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
          parallelDataSet="products"
        />
      )}
      {open && (
        <Add
          slug={slug}
          columns={columns}
          setOpen={setOpen}
          parallelDataSet="products"
        />
      )}
    </div>
  );
};

export default Solutions;
