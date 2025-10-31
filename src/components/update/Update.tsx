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
  materials?: any;
};

interface DropdownOption {
  _id: string;
  title: string;
}

interface DropdownOptions {
  materialNames: DropdownOption[];
  materialGrades: DropdownOption[];
  partNames: DropdownOption[];
  partGeneralIds: DropdownOption[];
}

const Update = (props: Props) => {
  const { row, slug } = props;
  const [selectedItems, setSelectedItems] = useState<DropdownOption[]>([]); // Store selected items
  const [image, setImage] = useState<any>();
  const [dropdownOptions, setDropdownOptions] = useState<DropdownOptions>({
    materialNames: [],
    materialGrades: [],
    partNames: [],
    partGeneralIds: [],
  });
  const [displayItems, setDisplayItems] = useState([]);

  const [reset, setReset] = useState(false);

  const [body, setBody] = useState<any>({});

  const queryClient = useQueryClient();

  const defaultImage = "/default-provider-image.png";

  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        const responses = await Promise.all([
          axios.get(`${import.meta.env.VITE_APP_URL}/materialNames`),
          axios.get(`${import.meta.env.VITE_APP_URL}/materialGrades`),
          axios.get(`${import.meta.env.VITE_APP_URL}/partNames`),
          axios.get(`${import.meta.env.VITE_APP_URL}/partGeneralIds`),
        ]);
        setDropdownOptions({
          materialNames: responses[0].data,
          materialGrades: responses[1].data,
          partNames: responses[2].data,
          partGeneralIds: responses[3].data,
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
        `${import.meta.env.VITE_APP_URL}${slug.single}/${row._id}`,
        data
      );
      console.log(response, "response");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["getAll", row.parallelDataSet]);
      props.setOpen(false);
    },
  });

  // const userMutation = useMutation({
  //   mutationFn: async (data: any) => {
  //     const response = await axios.patch(
  //       `${import.meta.env.VITE_APP_URL}user-update`,
  //       data
  //     );
  //     return response.data;
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(["getAll", row.parallelDataSet]);
  //     props.setOpen(false);
  //   },
  // });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitData = {
      selectedIds: selectedItems.map((item) => item._id), // Send only IDs
      ...body,
      ...(image ? { image } : {}),
    };

    console.log("submitData", submitData);

    mutation.mutate(submitData);
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

  const handleSelect = (option: DropdownOption) => {
    setSelectedItems((prev) => [...prev, option]); // Store the selected item
    setReset(true); // Reset the dropdown
  };
  useEffect(() => {
    if (reset) {
      setReset(false);
    }
  }, [reset]);

  const buttonClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const lastSelectedItem =
      selectedItems.length > 0 ? selectedItems[selectedItems.length - 1] : null;

    // @ts-ignore
    setDisplayItems((prev) => [...prev, lastSelectedItem]);
    if (lastSelectedItem) {
      console.log("Selected Item:", lastSelectedItem);
    } else {
      alert("Please select an item before submitting.");
    }
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
                            : column.field === "family_name"
                            ? row.family_name
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

                case "number": {
                  return (
                    <div className="item" key={index}>
                      <label>{column.headerName}</label>
                      <input
                        name={column.field}
                        type={column.type}
                        placeholder={
                          column.field === "age"
                            ? row.age
                            : column.field === "cellphone"
                            ? row.cellphone
                            : column.field === "phone"
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
                  let checked;
                  if (body[column.field] !== undefined) {
                    checked = body[column.field]; // Reflect user changes
                  } else if (
                    column.field === "has_export" ||
                    column.field === "knowledge_based"
                  ) {
                    checked = true;
                  } else if (row.isVerified) {
                    checked = true;
                  } else {
                    checked = false;
                  }
                  return (
                    <div className="item" key={index}>
                      <label>{column.headerName}</label>
                      <input
                        name={column.field}
                        type={column.type}
                        placeholder={column.field}
                        onChange={updateData}
                        checked={checked}
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
            {props.parallelDataSet === "materialNames" && (
              <>
                <p>what we already have :</p>
                {row.materialNames &&
                  row.materialNames.map((item: any) => (
                    <div className="flex flex-col p-4">{item.title}</div>
                  ))}
                <label>Material Name</label>
                {
                  <CustomDropdown
                    options={dropdownOptions.materialNames}
                    onSelect={handleSelect}
                    reset={reset}
                  />
                }
              </>
            )}
            {props.parallelDataSet === "partNames" && (
              <>
                <p>what we already have :</p>
                {row.partNames &&
                  row.partNames.map((item: any) => (
                    <div className="flex flex-col p-4">{item.title}</div>
                  ))}
                <label>Part Name</label>
                {
                  <CustomDropdown
                    options={dropdownOptions.partNames}
                    onSelect={handleSelect}
                    reset={reset}
                  />
                }
              </>
            )}

            {props.parallelDataSet === "materialGrades" && (
              <>
                <p>what we already have :</p>
                {row.materialGrades &&
                  row.materialGrades.map((item: any) => (
                    <div className="flex flex-col p-4">{item.title}</div>
                  ))}
                <label>Material Grade</label>
                {
                  <CustomDropdown
                    options={dropdownOptions.materialGrades}
                    onSelect={handleSelect}
                    reset={reset}
                  />
                }
              </>
            )}
            {props.parallelDataSet === "partGeneralIds" && (
              <>
                <p>what we already have :</p>
                {row.partGeneralIds &&
                  row.partGeneralIds.map((item: any) => (
                    <div className="flex flex-col p-4">{item.title}</div>
                  ))}
                <label>Part GeneralId</label>
                {
                  <CustomDropdown
                    options={dropdownOptions.partGeneralIds}
                    onSelect={handleSelect}
                    reset={reset}
                  />
                }
              </>
            )}
            {displayItems &&
              displayItems.map((item: any, index) => (
                <div key={index} className="flex flex-col">
                  {item?.title}
                </div>
              ))}
          </div>
          <button>Update</button>
        </form>
      </div>
    </div>
  );
};

export default Update;
