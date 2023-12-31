import { GridColDef } from "@mui/x-data-grid";
import "./update.scss";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

type Props = {
  slug: {
    title: string;
    route: string;
    single: string;
  };
  columns: GridColDef[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  parallelDataSet: string;
  row: any;
};

const Update = (props: Props) => {
  const { parallelDataSet, slug, row } = props;
  const [image, setImage] = useState<any>();
  const [body, setBody] = useState<any>({});
  console.log(row, "this is products row");

  async function getAll(parallelDataSet: string) {
    const res = await axios.get(
      `${import.meta.env.VITE_APP_URL}/${parallelDataSet}`
    );
    return res.data;
  }

  // TEST THE API

  const queryClient = useQueryClient();
  const { data: parallelData } = useQuery({
    queryKey: ["getAll", parallelDataSet],
    queryFn: () => getAll(parallelDataSet),
  });
  //   console.log(import.meta.env.VITE_APP_URL, slug.single);

  const mutation = useMutation({
    // mutationFn: async ({ formData, row }: any) => {
    mutationFn: async (body: any) => {
      const res = await axios.patch(
        `${import.meta.env.VITE_APP_URL}${slug.single}/${row._id}`,
        body
      );
      return console.log(res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries([`${slug.title}`], { exact: true });
    },
  });

  const updateData = (e: any) => {
    if (e.target.name === "instock") {
      setBody({
        ...body,
        [e.target.name]: e.target.checked,
      });
    } else {
      setBody({
        ...body,
        [e.target.name]: e.target.value,
      });
    }
  };
  // const handleImageSelect = (e: any) => {
  //   setImage(e.target.files[0]);
  // };
  const handleImageSelect = (e: any) => {
    const file = e.target.files[0];
    setFileToBase(file);
    console.log(file);
  };

  const setFileToBase = (file: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // const formData = new FormData();
    // if (!body.instock && slug.title === "products") {
    //   formData.append("instock", "false");
    // }
    // formData.append("image", image);
    // for (const key in body) {
    //   formData.append(`${key}`, body[key]);
    // }

    // for (const value of formData.values()) {
    //   console.log(value);
    // }
    body.image = image;
    console.log(body, "this is the body");
    mutation.mutate(body, row);

    props.setOpen(false);
  };

  return (
    <div className="add">
      <div className="modal">
        <span className="close" onClick={() => props.setOpen(false)}>
          X
        </span>
        <h1>Update {row.title || row.model}</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="item">
            <label>Image</label>
            <input
              type="file"
              placeholder="Add Image Here"
              onChange={handleImageSelect}
              name="image"
            />
            <img
              src={row.image.url}
              alt="image"
              style={{ height: "150px", width: "150px" }}
            />
          </div>
          {props.columns
            .filter((item) => item.field !== "id" && item.field !== "img")
            .map((column, index) => {
              switch (column.type) {
                case "text": {
                  return (
                    <div className="item" key={index}>
                      <label>{column.headerName}</label>
                      <input
                        name={column.field}
                        type={column.type}
                        placeholder={
                          column.field === "title"
                            ? row.title
                            : column.field === "description"
                            ? row.description
                            : column.field === "model"
                            ? row.model
                            : ""
                          //   column.field === "title" ? row.title : row.description
                        }
                        onChange={updateData}
                      />
                    </div>
                  );
                  break;
                }
                case "options": {
                  if (
                    slug.title !== "categories" &&
                    slug.title !== "solutions"
                  ) {
                    return (
                      <div className="item" key={index}>
                        <label>{column.headerName}</label>

                        <select
                          id="cars"
                          multiple
                          onChange={updateData}
                          name={column.field}
                        >
                          {parallelData &&
                            parallelData.map((data: any) => (
                              <option value={data._id} key={data._id}>
                                {data.title || data.model}
                              </option>
                            ))}
                        </select>
                        <p>
                          {parallelDataSet === "subcategories"
                            ? row.subcategories
                            : row.categories}
                        </p>
                      </div>
                    );
                    break;
                  } else {
                    return (
                      <p>
                        {parallelDataSet === "subcategories"
                          ? row.subcategories
                          : row.categories}
                      </p>
                    );
                  }
                }

                case "number": {
                  return (
                    <div className="item" key={index}>
                      <label>{column.headerName}</label>
                      <input
                        name={column.field}
                        type={column.type}
                        placeholder={column.field}
                        onChange={updateData}
                      />
                    </div>
                  );
                  break;
                }
                case "checkbox": {
                  return (
                    <div className="item" key={index}>
                      <label>{column.headerName}</label>
                      <input
                        name={column.field}
                        type={column.type}
                        placeholder={column.field}
                        onChange={updateData}
                      />
                    </div>
                  );
                  break;
                }

                default:
                  break;
              }
            })}
          <button>Update</button>
        </form>
      </div>
    </div>
  );
};

export default Update;
