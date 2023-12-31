import { useState } from "react";
import "./subCategories.css";
import DataTable from "../../components/dataTable/DataTable";
import Add from "../../components/add/Add";
import { GridColDef } from "@mui/x-data-grid";
// import { products } from "../../data";
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
    type: "text",
    headerName: "Description",
    width: 150,
  },

  {
    field: "categories",
    headerName: "categories",
    width: 150,
    type: "options",
  },
  {
    field: "slug",
    headerName: "slug",
    width: 150,
    type: "string",
  },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 200,
    type: "string",
  },
];

const SubCategories = () => {
  const [open, setOpen] = useState(false);
  const slug = {
    title: "subcategories",
    route: "createSubCategory",
    single: "subCategory",
  };

  // TEST THE API

  const { isLoading, data } = useQuery({
    queryKey: ["subcategories"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_APP_URL}subCategories`).then((res) =>
        res.json()
      ),
  });

  return (
    <div className="subcategories">
      <div className="info">
        <h1>Subcategories</h1>
        <button onClick={() => setOpen(true)}>Add New Subcategory</button>
      </div>
      {/* <DataTable slug="categories" columns={columns} rows={products} /> */}
      {/* TEST THE API */}

      {isLoading ? (
        "Loading..."
      ) : (
        <DataTable
          slug={slug}
          columns={columns}
          rows={data}
          parallelDataSet="categories"
        />
      )}
      {open && (
        <Add
          slug={slug}
          columns={columns}
          setOpen={setOpen}
          parallelDataSet="categories"
        />
      )}
    </div>
  );
};

export default SubCategories;
