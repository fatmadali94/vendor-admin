import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import "./dataTable.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Update from "../update/Update";
import UpdateMaterialProvider from "../update/UpdateMaterialProvider";
import UpdatePartProvider from "../update/UpdatePartProvider";
import ShowFiles from "../showFiles/ShowFiles";

type Props = {
  columns: GridColDef[];
  rows: Array<any>;
  slug: any;
  parallelDataSet: any;
  materials: any;
  parts: any;
};

interface userRow {
  uploadedFiles?: any; // This makes uploadedFiles an optional property
}

const DataTable = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [row, setRow] = useState({});
  const [userRow, setUserRow] = useState<userRow>({});
  const [filesOpen, setFilesOpen] = useState(false);

  const { materials, parts } = props;
  const isPart = !!parts;
  const isMaterial = !!materials;

  const newRows =
    props?.rows?.length > 0 && materials
      ? props?.rows?.map((row) => {
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
      : props?.rows?.length > 0 && parts
      ? props?.rows?.map((row) => {
          let partgeneralids = "";
          let partnames = "";
          let partgroups = "";

          if (row.records && row.records.length > 0) {
            row.records.forEach(
              (record: {
                partgeneralid: { title: string };
                partname: { title: string };
                partgroup: { title: string };
              }) => {
                if (record.partgeneralid && record.partgeneralid.title) {
                  partgeneralids += record.partgeneralid.title + ", ";
                }
                if (record.partname && record.partname.title) {
                  partnames += record.partname.title + ", ";
                }
                if (record.partgroup && record.partgroup.title) {
                  partgroups += record.partgroup.title + ", ";
                }
              }
            );
          }
          return {
            ...row,
            partgeneralids, // Append concatenated material grade titles
            partnames, // Append concatenated material name titles
            partgroups, // Append concatenated material group titles
          };
        })
      : props.rows;

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

  const handleFiles = (row: any) => {
    setFilesOpen(true);
    setUserRow(row);
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
          {params.row.title === "Offers" && (
            <div>
              {/* <img
              src={params?.row?.image?.url}
              alt=""
              style={{ width: "50px", height: "50px" }}
            /> */}
              <a href={params?.row?.image?.url} download>
                <button
                  style={{
                    padding: "5px",
                    backgroundColor: "#555",
                    color: "#fff",
                    borderRadius: "10px",
                  }}
                >
                  دانلود فایل
                </button>
              </a>
            </div>
          )}

          {params.row.uploadedFiles.length > 0 && (
            <button
              style={{
                padding: "5px 10px",
                backgroundColor: "white",
                borderRadius: "10px",
              }}
              onClick={() => handleFiles(params.row)}
            >
              Files
            </button>
          )}
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
      {open &&
        (isMaterial ? (
          <UpdateMaterialProvider
            slug={props.slug}
            columns={props.columns}
            setOpen={setOpen}
            parallelDataSet={props.parallelDataSet}
            row={row || []}
            materials={materials}
          />
        ) : isPart ? (
          <UpdatePartProvider
            slug={props.slug}
            columns={props.columns}
            setOpen={setOpen}
            parallelDataSet={props.parallelDataSet}
            row={row || []}
            parts={parts}
          />
        ) : (
          <Update
            slug={props.slug}
            columns={props.columns}
            setOpen={setOpen}
            parallelDataSet={props.parallelDataSet}
            row={row || []}
            materials={materials}
          />
        ))}
      {filesOpen && (
        <ShowFiles
          uploadedFiles={userRow?.uploadedFiles}
          setFilesOpen={setFilesOpen}
        />
      )}
    </div>
  );
};

export default DataTable;
