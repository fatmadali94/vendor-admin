import { useState } from "react";
import "./categories.scss";
import DataTable from "../../components/dataTable/DataTable";
import Add from "../../components/add/Add";

import { GridColDef } from "@mui/x-data-grid";
// import { categories } from "../../data";
// import axios from "axios";
import { useQuery } from "@tanstack/react-query";
// import AddCategories from "../../components/addCategories/AddCategories";

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
    field: "subcategories",
    headerName: "subcategories",
    width: 150,
    type: "options",
  },
];

const Categories = () => {
  const [open, setOpen] = useState(false);
  const slug = {
    title: "categories",
    route: "createCategory",
    single: "category",
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
    queryKey: ["categories"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_APP_URL}categories`).then((res) =>
        res.json()
      ),
  });
  // console.log(import.meta.env.VITE_APP_URL);
  // console.log(data, "this is categories");

  return (
    <div className="categories">
      <div className="info">
        <h1>Categories</h1>
        <button onClick={() => setOpen(true)}>Add New Categories</button>
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
          parallelDataSet="subCategories"
        />
      )}
      {open && (
        <Add
          slug={slug}
          columns={columns}
          setOpen={setOpen}
          parallelDataSet="subCategories"
        />
      )}
      {/* {open && (
        <AddCategories
          slug={slug}
          columns={columns}
          setOpen={setOpen}
          parallelDataSet="subCategories"
        />
      )} */}
    </div>
  );
};

export default Categories;
