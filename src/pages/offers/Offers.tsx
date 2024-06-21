// import { useState } from "react";
import "./offers.scss";
import "./offers.css";
import DataTable from "../../components/dataTable/DataTable";
// import Add from "../../components/add/Add";
import { GridColDef } from "@mui/x-data-grid";
// import { partGeneralIds } from "../../data";
import { useQuery } from "@tanstack/react-query";
// import { useNewOffersCount } from "../../helpers/fetchOffers";

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
    headerName: "title",
    width: 150,
  },
  {
    field: "name",
    type: "text",
    headerName: "name",
    width: 150,
  },
  {
    field: "email",
    type: "text",
    headerName: "email",
    width: 150,
  },
  {
    field: "phone",
    type: "number",
    headerName: "phone",
    width: 150,
  },

  {
    field: "description",
    headerName: "Description",
    type: "text",
    width: 400,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 200,
    type: "string",
  },
];

const Offers = () => {
  const slug = {
    title: "offers",
    route: "createOffer",
    single: "offer",
  };
  // TEST THE API

  const { isLoading, data } = useQuery({
    queryKey: ["offers"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_APP_URL}offers`).then((res) => res.json()),
  });

  console.log(data, "data");

  return (
    <div className="exhibitions">
      <div className="info">
        <h1>Offers</h1>
      </div>

      {isLoading ? (
        "Loading..."
      ) : (
        <DataTable
          slug={slug}
          columns={columns}
          rows={data}
          parallelDataSet="offers"
          materials={undefined}
        />
      )}
    </div>
  );
};

export default Offers;
