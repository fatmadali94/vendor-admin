import { useQuery } from "@tanstack/react-query";
import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/dataTable/DataTable";
import "./Users.scss";

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
    field: "name",
    type: "text",
    headerName: "name",
    width: 100,
  },
  {
    field: "family_name",
    type: "text",
    headerName: "family_name",
    width: 100,
  },
  {
    field: "email",
    type: "email",
    headerName: "email",
    width: 150,
  },
  {
    field: "username",
    type: "email",
    headerName: "username",
    width: 150,
  },
  {
    field: "cellphone",
    type: "number",
    headerName: "cellphone",
    width: 150,
  },

  {
    field: "age",
    headerName: "age",
    type: "number",
    width: 400,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 200,
    type: "string",
  },
  {
    field: "isVerified",
    type: "checkbox",
    headerName: "isVerified",
    width: 150,
  },
];

const Users = () => {
  const slug = {
    title: "users",
    route: "createUser",
    single: "user",
  };
  // TEST THE API

  const { isLoading, data } = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_APP_URL}get-users`).then((res) =>
        res.json()
      ),
  });

  return (
    <div className="exhibitions">
      <div className="info">
        <h1>USERS</h1>
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
          parts={undefined}
        />
      )}
    </div>
  );
};

export default Users;
