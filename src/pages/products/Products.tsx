import { useState } from "react";
import "./Products.css";
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
    field: "model",
    type: "text",
    headerName: "Model",
    width: 150,
  },
  {
    field: "price",
    type: "number",
    headerName: "Price",
    width: 100,
  },
  {
    field: "description",
    headerName: "Description",
    type: "text",
    width: 200,
  },

  {
    field: "instock",
    headerName: "In Stock",
    width: 100,
    type: "checkbox",
  },
  {
    field: "subcategories",
    headerName: "subcategories",
    width: 150,
    type: "options",
  },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 200,
    type: "string",
  },
];

const Products = () => {
  const [open, setOpen] = useState(false);

  const slug = { title: "products", route: "createProduct", single: "product" };
  // TEST THE API

  const { isLoading, data } = useQuery({
    queryKey: ["products"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_APP_URL}products`).then((res) =>
        res.json()
      ),
  });

  return (
    <div className="products">
      <div className="info">
        <h1>Products</h1>
        <button onClick={() => setOpen(true)}>Add New Product</button>
      </div>
      {/* <DataTable slug="products" columns={columns} rows={products} /> */}
      {/* TEST THE API */}

      {isLoading ? (
        "Loading..."
      ) : (
        <DataTable
          slug={slug}
          columns={columns}
          rows={data}
          parallelDataSet="subcategories"
        />
      )}
      {open && (
        <Add
          slug={slug}
          columns={columns}
          setOpen={setOpen}
          parallelDataSet="subcategories"
        />
      )}
    </div>
  );
};

export default Products;
