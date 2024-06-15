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
  materials: any;
  // parallelDataSets: any;
};

const DataTable = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [row, setRow] = useState({});
  console.log(row);

  const { materials } = props;

  const newRows =
    props.rows.length > 0
      ? props.rows.map((row) => {
          let materialgrades = "";
          let materialnames = "";
          let materialgroups = "";

          if (row.records && row.records.length > 0) {
            row.records.forEach(
              (record: {
                materialgrade: { title: string };
                materialname: { title: string };
                materialgroup: { title: string };
              }) => {
                if (record.materialgrade && record.materialgrade.title) {
                  materialgrades += record.materialgrade.title + ", ";
                }
                if (record.materialname && record.materialname.title) {
                  materialnames += record.materialname.title + ", ";
                }
                if (record.materialgroup && record.materialgroup.title) {
                  materialgroups += record.materialgroup.title + ", ";
                }
              }
            );
          }
          return {
            ...row,
            materialgrades, // Append concatenated material grade titles
            materialnames, // Append concatenated material name titles
            materialgroups, // Append concatenated material group titles
          };
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
      return (
        <div className="action">
          <img
            src="/view.svg"
            alt=""
            onClick={() => handleUpdate(params.row)}
          />
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
          materials={materials}
        />
      )}
    </div>
  );
};

export default DataTable;
