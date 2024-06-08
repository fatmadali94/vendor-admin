import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import "./dataTable.scss";
// import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Update from "../update/Update";

type Props = {
  columns: GridColDef[];
  rows: Array<any>;
  slug: any;
  parallelDataSet: any;
  // parallelDataSets: any;
};

const DataTable = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [row, setRow] = useState({});

  const newRows =
    props.rows.length > 0
      ? props.rows.map((row) => {
          if (row[props.parallelDataSet]) {
            const secondaryTitle = row[props.parallelDataSet].map(
              (sec: any) => sec.title
            );

            return {
              ...row,
              [props.parallelDataSet]: secondaryTitle.toString(),
            };
          } else {
            return row;
          }
        })
      : "";

  // TEST THE API

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: number) => {
      return fetch(
        `${import.meta.env.VITE_APP_URL}${props.slug.single}/${id}`,
        {
          method: "delete",
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries([`${props.slug.title}`]);
    },
  });

  const handleDelete = (id: any) => {
    mutation.mutate(id);
  };
  const handleUpdate = (row: any) => {
    setOpen(true);
    setRow(row);
  };

  const actionColumn: GridColDef = {
    field: "action",
    headerName: "Action",
    width: 200,
    renderCell: (params) => {
      // console.log(params.row, "this is row id");

      return (
        <div className="action">
          {/* <button onClick={() => setOpen(true)}>Add New Product</button> */}
          {/* <Link to={`/${props.slug.title}/${params.row.id}`}> */}
          <img
            src="/view.svg"
            alt=""
            onClick={() => handleUpdate(params.row)}
          />
          {/* </Link> */}
          <div className="delete" onClick={() => handleDelete(params.row._id)}>
            <img src="/delete.svg" alt="" />
          </div>
        </div>
      );
    },
  };
  const getRowId = (row: any) => {
    return row._id;
  };

  return (
    <div className="dataTable">
      <DataGrid
        className="dataGrid"
        rows={newRows || []}
        columns={[...props.columns, actionColumn]}
        getRowId={getRowId}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        disableColumnFilter
        disableDensitySelector
        disableColumnSelector
      />
      {open && (
        <Update
          slug={props.slug}
          columns={props.columns}
          setOpen={setOpen}
          parallelDataSet={props.parallelDataSet}
          row={row || []}
        />
      )}
    </div>
  );
};

export default DataTable;
