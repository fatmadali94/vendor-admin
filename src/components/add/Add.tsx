import { GridColDef } from "@mui/x-data-grid";
import "./add.scss";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

type Props = {
  slug: {
    title: string;
    route: string;
  };
  columns: GridColDef[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  parallelDataSet: any;
  parallelDataSets: any;
};

const Add = (props: Props) => {
  const { parallelDataSet, parallelDataSets, slug } = props;
  const [value1, value2, value3] = parallelDataSets!;
  const [image, setImage] = useState<any>();
  const [body, setBody] = useState<any>({});

  const getAll = async (parallelDataSet: string) => {
    return axios
      .get(`${import.meta.env.VITE_APP_URL}/${parallelDataSet}`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        // `error` is defined here
        throw error.response.data;
      });
    // return await axios
    //   .get(`${import.meta.env.VITE_APP_URL}/${parallelDataSet}`)
    //   .then((res) => res.data);
  };
  const parallelDataSetsHandler = async () => {
    try {
      const res = await Promise.all([
        axios.get(`${import.meta.env.VITE_APP_URL}/${value1.title}`),
        axios.get(`${import.meta.env.VITE_APP_URL}/${value2.title}`),
        axios.get(`${import.meta.env.VITE_APP_URL}/${value3.title}`),
      ]);
      const data = res.map((res) => res.data);
      return data;
      // console.log(data.flat());
    } catch {
      throw Error("Promise failed");
    }

    // now `responses` is an array of the response data
  };

  const queryClient = useQueryClient();
  if (parallelDataSets !== "") {
    var { data: newData } = useQuery({
      queryKey: ["getParallel"],
      queryFn: () => parallelDataSetsHandler(),
    });
  }
  if (parallelDataSet) {
    var { data: parallelData } = useQuery({
      queryKey: ["getAll", parallelDataSet],
      queryFn: () => getAll(parallelDataSet),
    });
  }

  const createItem = async (body: any) => {
    return axios
      .post(`${import.meta.env.VITE_APP_URL}${slug.route}`, body)
      .then((res) => res.data);
  };

  const mutation = useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries([`${slug.title}`], { exact: true });
    },
  });
  // console.log(body, "this is updating body");
  // console.log(image, "this is image");

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
  //   const handleImageSelect = (e: any) => {
  //     setImage(e.target.files[0]);
  //   };
  const handleImageSelect = (e: any) => {
    const file = e.target.files[0];
    setFileToBase(file);
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
    body.image = image;
    console.log(body, "this is the body");

    mutation.mutate(body);
    props.setOpen(false);
    alert("addition successful");
  };

  return (
    <div className="add">
      <div className="modal">
        <span className="close" onClick={() => props.setOpen(false)}>
          X
        </span>
        <h1>Add new {props.slug.title}</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="item">
            <label>Image</label>
            <input
              type="file"
              placeholder="Add Image Here"
              onChange={handleImageSelect}
              name="image"
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
                        placeholder={column.field}
                        onChange={updateData}
                      />
                    </div>
                  );
                  break;
                }
                case "email": {
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
                case "password": {
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
                case "options": {
                  return (
                    <div className="item" key={index}>
                      <label>{column.headerName}</label>

                      <select
                        id="options"
                        multiple
                        onChange={updateData}
                        name={column.field}
                      >
                        {newData &&
                          parallelDataSets !== "" &&
                          column.headerName === parallelDataSets[0].title &&
                          newData[0].map((data: any) => (
                            <option value={data._id} key={data._id}>
                              {data.title || data.model}
                            </option>
                          ))}
                        {newData &&
                          parallelDataSets !== "" &&
                          column.headerName === parallelDataSets[1].title &&
                          newData[1].map((data: any) => (
                            <option value={data._id} key={data._id}>
                              {data.title || data.model}
                            </option>
                          ))}
                        {newData &&
                          parallelDataSets !== "" &&
                          column.headerName === parallelDataSets[2].title &&
                          newData[2].map((data: any) => (
                            <option value={data._id} key={data._id}>
                              {data.title || data.model}
                            </option>
                          ))}
                        {parallelData &&
                          parallelData.map((data: any) => (
                            <option value={data._id} key={data._id}>
                              {data.title || data.model}
                            </option>
                          ))}
                      </select>
                    </div>
                  );
                  break;
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
          <button>Send</button>
        </form>
      </div>
    </div>
  );
};

export default Add;
