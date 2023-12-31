import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/dataTable/DataTable";
import "./Users.scss";
import { useState } from "react";
import Add from "../../components/add/Add";
// import { userRows } from "../../data";
import { useQuery } from "@tanstack/react-query";
import { UserRequest } from "../../helpers/requestMethods";
// import {userRequest} from '../../helpers/requestMethods.js'
// import userRequest from "../../helpers/requestMethods";

// import { UserRequest } from "../../helpers/requestMethods";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  // {
  //   field: "img",
  //   headerName: "Avatar",
  //   width: 100,
  //   renderCell: (params) => {
  //     return <img src={params.row.img || "/noavatar.png"} alt="" />;
  //   },
  // },
  {
    field: "username",
    type: "text",
    headerName: "First name",
    width: 150,
  },
  {
    field: "email",
    type: "email",
    headerName: "Email",
    width: 200,
  },
  {
    field: "password",
    type: "password",
    headerName: "Password",
    width: 200,
  },
  {
    field: "isAdmin",
    type: "checkbox",
    headerName: "isAdmin",
    width: 100,
  },

  // {
  //   field: "firstName",
  //   type: "text",
  //   headerName: "First name",
  //   width: 150,
  // },
  // {
  //   field: "firstName",
  //   type: "text",
  //   headerName: "First name",
  //   width: 150,
  // },
  // {
  //   field: "lastName",
  //   type: "text",
  //   headerName: "Last name",
  //   width: 150,
  // },

  // {
  //   field: "phone",
  //   type: "number",
  //   headerName: "Phone",
  //   width: 200,
  // },
  // {
  //   field: "createdAt",
  //   headerName: "Created At",
  //   width: 200,
  //   type: "string",
  // },
  // {
  //   field: "verified",
  //   headerName: "Verified",
  //   width: 150,
  //   type: "boolean",
  // },
];

const Users = () => {
  const [open, setOpen] = useState(false);
  const slug = {
    title: "users",
    route: "users/register",
    single: "user",
  };

  // TEST THE API
  const localValue: any = JSON.parse(localStorage.getItem("store") || "");
  const { accessToken } = localValue?.state.user[1].currentUser.accessToken;
  console.log(accessToken, "THIS IS THE ACCESS");

  const { isLoading, data } = useQuery({
    queryKey: ["users"],
    // queryFn: async () => await UserRequest.get("users"),
    queryFn: () =>
      fetch(`${import.meta.env.VITE_APP_URL}users`).then((res) => res.json()),
  });

  console.log(data, "USERS");

  return (
    <div className="users">
      <div className="info">
        <h1>Users</h1>
        <button onClick={() => setOpen(true)}>Add New User</button>
      </div>
      {/* <DataTable slug={slug} columns={columns} rows={userRows} /> */}
      TEST THE API
      {isLoading ? (
        "Loading..."
      ) : (
        <DataTable
          slug={slug}
          columns={columns}
          rows={data || []}
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

export default Users;
