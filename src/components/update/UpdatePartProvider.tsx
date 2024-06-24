import { GridColDef } from "@mui/x-data-grid";
import "./update.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";
import CustomDropdown from "../customDropdown/CustomDropdown";

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
  parts: any;
};

interface DropdownOption {
  _id: string;
  title: string;
}

interface DropdownOptions {
  partNames: DropdownOption[];
  partGeneralIds: DropdownOption[];
  partGroups: DropdownOption[];
}

interface selections {
  partGeneralId: any;
  partname: any;
  partGroup: any;
}

const UpdatePartProvider = (props: Props) => {
  const { row, parts } = props;

  const [formData, setFormData] = useState({ records: row.records || [] });
  const [image, setImage] = useState<any>();
  const [dropdownOptions, setDropdownOptions] = useState<DropdownOptions>({
    partNames: [],
    partGeneralIds: [],
    partGroups: [],
  });

  const [selections, setSelections] = useState<selections>({
    partGeneralId: {},
    partGroup: {},
    partname: {},
  });
  const [reset, setReset] = useState(false);

  const [body, setBody] = useState<any>({});

  const queryClient = useQueryClient();

  const defaultImage = "/default-provider-image.png";

  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        const responses = await Promise.all([
          axios.get(`${import.meta.env.VITE_APP_URL}/partNames`),
          axios.get(`${import.meta.env.VITE_APP_URL}/partGeneralIds`),
          axios.get(`${import.meta.env.VITE_APP_URL}/partGroups`),
        ]);
        setDropdownOptions({
          partNames: responses[0].data,
          partGeneralIds: responses[1].data,
          partGroups: responses[2].data,
        });
      } catch (error) {
        console.error("Failed to fetch dropdown options:", error);
      }
    };
    fetchDropdownOptions();
  }, []);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.patch(
        `${import.meta.env.VITE_APP_URL}/partProvider/${row._id}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["getAll", row.parallelDataSet]);
      props.setOpen(false);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      ...body,
      image,
    };

    mutation.mutate(submitData);
  };

  const handleInputChange = (index: number, field: string, value: string) => {
    const updatedRecords = formData.records.map((record: any, idx: any) => {
      if (idx === index) {
        return { ...record, [field]: value };
      }
      return record;
    });
    setFormData({ ...formData, records: updatedRecords });
  };

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

  const handleDelete = (id: any) => {
    const updatedRecords = formData.records.filter(
      (record: any) => record?._id !== id
    );
    setFormData({
      ...formData,
      records: updatedRecords,
    });
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

  const buttonClickHandler = (event: any) => {
    event.preventDefault();
    setFormData({
      ...formData,
      records: [...formData.records, selections], // Append the new object to the array
    });
    setReset(true);
  };

  return (
    <div className="update">
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
              src={row?.image?.url || defaultImage}
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
                          column.field === "name"
                            ? row.name
                            : column.field === "description"
                            ? row.description
                            : column.field === "address"
                            ? row.address
                            : column.field === "link"
                            ? row.link
                            : column.field === "export_destination"
                            ? row.export_destination
                            : ""
                        }
                        onChange={updateData}
                      />
                    </div>
                  );
                  break;
                }

                case "record": {
                  return (
                    row &&
                    formData.records.map((record: any, index: any) => (
                      <div
                        key={index}
                        style={{
                          border: "1px solid white",
                          padding: "10px",
                          margin: 10,
                        }}
                      >
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <label>Part Name</label>
                          <select
                            value={record.partname?._id || record.partname}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "partname",
                                e.target.value
                              )
                            }
                          >
                            {dropdownOptions.partNames.map((option) => (
                              <option key={option._id} value={option._id}>
                                {option.title}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <label>Part General Id</label>
                          <select
                            value={
                              record.partgeneralid?._id || record.partgeneralid
                            }
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "partgeneralid",
                                e.target.value
                              )
                            }
                          >
                            {dropdownOptions.partGeneralIds.map((option) => (
                              <option key={option._id} value={option._id}>
                                {option.title}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <label>Part Group</label>
                          <select
                            value={record.partgroup?._id || record.partgroup}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "partgroup",
                                e.target.value
                              )
                            }
                          >
                            {dropdownOptions.partGroups.map((option) => (
                              <option key={option._id} value={option._id}>
                                {option.title}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleDelete(record?._id);
                            }}
                            style={{
                              backgroundColor: "red",
                              fontSize: "20px",
                              color: "white",
                              marginTop: "5px",
                            }}
                          >
                            delete
                          </button>
                        </div>
                      </div>
                    ))
                  );
                }

                case "number": {
                  return (
                    <div className="item" key={index}>
                      <label>{column.headerName}</label>
                      <input
                        name={column.field}
                        type={column.type}
                        placeholder={
                          column.field === "phone"
                            ? row.phone
                            : column.field === "score"
                            ? row.score
                            : column.field === "establish_year"
                            ? row.establish_year
                            : column.field === "production_volume"
                            ? row.production_volume
                            : column.field === "cooperation_length"
                            ? row.cooperation_length
                            : ""
                        }
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
                        placeholder={row.email}
                        onChange={updateData}
                      />
                    </div>
                  );
                  break;
                }

                case "checkbox": {
                  const isChecked =
                    body[column.field] !== undefined
                      ? body[column.field]
                      : row[column.field];

                  return (
                    <div className="item" key={index}>
                      <label>{column.headerName}</label>
                      <input
                        name={column.field}
                        type={column.type}
                        placeholder={column.field}
                        onChange={updateData}
                        checked={!!isChecked}
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
                        value={
                          body.production_type
                            ? body.production_type
                            : row.production_type
                        }
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

                case "button": {
                  return (
                    <div className="item" key={index}>
                      <label>{column.headerName}</label>
                      <button onClick={buttonClickHandler}>Submit</button>
                    </div>
                  );
                  break;
                }

                default:
                  break;
              }
            })}
          <div className="item">
            <label>Part Group</label>
            {parts && parts[0] && (
              <CustomDropdown
                options={parts[0]}
                onSelect={(option: any) => handleSelect("partgroup", option)}
                reset={reset}
              />
            )}
            <label>Part Name</label>
            {parts && parts[1] && (
              <CustomDropdown
                options={parts[1]}
                onSelect={(option: any) => handleSelect("partname", option)}
                reset={reset}
              />
            )}
            <label>Part general id </label>
            {parts && parts[2] && (
              <CustomDropdown
                options={parts[2]}
                onSelect={(option: any) =>
                  handleSelect("partgeneralid", option)
                }
                reset={reset}
              />
            )}
          </div>
          <button>Update</button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePartProvider;
