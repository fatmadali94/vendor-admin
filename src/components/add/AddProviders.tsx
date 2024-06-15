import { useState, useEffect } from "react";
import { GridColDef } from "@mui/x-data-grid";
import "./add.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import CustomDropdown from "../customDropdown/CustomDropdown";
type Props = {
  slug: {
    title: string;
    route: string;
  };
  columns: GridColDef[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  parallelDataSets: any;
  materials: any;
};

interface selections {
  materialgrade: any;
  materialname: any;
  materialgroup: any;
}

interface submissions {
  materialgrade: number;
  materialname: number;
  materialgroup: number;
}
interface displaySubmission {
  materialgrade: String;
  materialname: String;
  materialgroup: String;
}

const AddProviders = (props: Props) => {
  const { parallelDataSets, slug, materials } = props;
  const [image, setImage] = useState<any>();
  const [body, setBody] = useState<any>({});
  const [selections, setSelections] = useState<selections>({
    materialgrade: {},
    materialgroup: {},
    materialname: {},
  });
  const [reset, setReset] = useState(false);
  const [submissions, setSubmissions] = useState<submissions[]>([]);
  const [displaySubmission, setDisplaySubmission] = useState<
    displaySubmission[]
  >([]);
  console.log(body, "body");

  const createItem = async (body: any) => {
    return axios
      .post(`${import.meta.env.VITE_APP_URL}${slug.route}`, body)
      .then((res) => res.data);
  };
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries([`${slug.title}`], { exact: true });
    },
  });

  const updateData = (e: any) => {
    const { name, type, checked, value } = e.target;
    setBody((prevBody: any) => ({
      ...prevBody,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    body.has_export = body.has_export ? true : false;
    body.knowledge_based = body.knowledge_based ? true : false;
    body.image = image;
    body.records = submissions;
    mutation.mutate(body);
    props.setOpen(false);
    alert("تامین کننده با موفقیت اضافه شد ");
  };

  const buttonClickHandler = (event: any) => {
    event.preventDefault();
    setSubmissions([
      ...submissions,
      {
        materialgroup: selections.materialgroup._id,
        materialgrade: selections.materialgrade._id,
        materialname: selections.materialname._id,
      },
    ]);
    setDisplaySubmission([
      ...displaySubmission,
      {
        materialgroup: selections.materialgroup.title,
        materialgrade: selections.materialgrade.title,
        materialname: selections.materialname.title,
      },
    ]);
    setReset(true);
  };

  const handleSelect = (dropdownName: any, selectedOption: any) => {
    setSelections((prevState) => ({
      ...prevState,
      [dropdownName]: selectedOption,
    }));
  };

  useEffect(() => {
    if (reset) {
      setReset(false);
    }
  }, [reset]);

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
                case "dropdown": {
                  return (
                    <div className="item" key={index}>
                      <label>نوع تولید</label>
                      <select
                        name="production_type"
                        onChange={updateData}
                        style={{ height: "30px" }}
                      >
                        <option value="industrial-production">صنعتی</option>
                        <option value="semi-industrial-production">
                          نیمه صنعتی
                        </option>
                        <option value="trial-production">آزمایشی</option>
                      </select>
                    </div>
                  );
                  break;
                }
                case "options": {
                  return (
                    <div className="item" key={index}>
                      <label>{column.headerName}</label>
                      {materials &&
                        parallelDataSets !== "" &&
                        column.headerName === parallelDataSets[0].title && (
                          <CustomDropdown
                            options={materials[0]}
                            onSelect={(option: any) =>
                              handleSelect("materialgroup", option)
                            }
                            reset={reset}
                          />
                        )}
                      {materials &&
                        parallelDataSets !== "" &&
                        column.headerName === parallelDataSets[1].title && (
                          <CustomDropdown
                            options={materials[1]}
                            onSelect={(option: any) =>
                              handleSelect("materialname", option)
                            }
                            reset={reset}
                          />
                        )}
                      {materials &&
                        parallelDataSets !== "" &&
                        column.headerName === parallelDataSets[2].title && (
                          <CustomDropdown
                            options={materials[2]}
                            onSelect={(option: any) =>
                              handleSelect("materialgrade", option)
                            }
                            reset={reset}
                          />
                        )}
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
                    <div className="row-item" key={index}>
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
                case "button": {
                  return (
                    <div className="item" key={index}>
                      <label>{column.headerName}</label>
                      <button onClick={buttonClickHandler}>Submit</button>
                    </div>
                  );
                  break;
                }
                case "record": {
                  return (
                    <div
                      className="item"
                      style={{ width: "100%", padding: "10px 0" }}
                    >
                      <table>
                        <thead>
                          <tr style={{ textAlign: "left" }}>
                            <th>Material Group</th>
                            <th>Material Name</th>
                            <th>Material Grade</th>
                          </tr>
                        </thead>

                        <tbody>
                          {displaySubmission.map((submission: any, index) => (
                            <tr key={index}>
                              <td>{submission.materialgroup}</td>
                              <td>{submission.materialname}</td>
                              <td>{submission.materialgrade}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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

export default AddProviders;
