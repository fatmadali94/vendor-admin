import { useState } from "react";
import "./Products.scss";
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
    field: "description",
    headerName: "Description",
    type: "text",
    width: 200,
  },
  {
    field: "title",
    headerName: "title",
    type: "text",
    width: 200,
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

  const slug = {
    title: "Products",
    route: "createProduct",
    single: "Product",
  };
  // TEST THE API

  const { isLoading, data } = useQuery({
    queryKey: ["Products"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_APP_URL}products`).then((res) =>
        res.json()
      ),
  });

  return (
    <div className="Products">
      <div className="info">
        <h1>Products</h1>
        <button onClick={() => setOpen(true)}>Add New Product</button>
      </div>

      {isLoading ? (
        "Loading..."
      ) : (
        <DataTable
          slug={slug}
          columns={columns}
          rows={data}
          parallelDataSet="Products"
          materials={undefined}
          parts={undefined}
        />
      )}
      {open && (
        <Add
          slug={slug}
          columns={columns}
          setOpen={setOpen}
          parallelDataSet="products"
          parallelDataSets=""
        />
      )}
    </div>
  );
};

export default Products;
