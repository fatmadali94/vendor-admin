import { useState } from "react";
import "./add.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type Props = {
  slug: {
    title: string;
    route: string;
  };
  columns: any[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddExhibition = ({ slug, columns, setOpen }: Props) => {
  const [image, setImage] = useState<string | null>(null);
  const [body, setBody] = useState<any>({
    company: {},
    quote: {},
  });
  const queryClient = useQueryClient();

  const createItem = async (body: any) => {
    return axios
      .post(`${import.meta.env.VITE_APP_URL}${slug.route}`, body)
      .then((res) => res.data);
  };

  const mutation = useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries([slug.title], { exact: true });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
  };

  const updateData = (e: any) => {
    const { name, value } = e.target;

    if (name.startsWith("company.")) {
      const key = name.split(".")[1];
      setBody((prev: any) => ({
        ...prev,
        company: {
          ...prev.company,
          [key]: value,
        },
      }));
    } else if (name.startsWith("quote.")) {
      const key = name.split(".")[1];
      setBody((prev: any) => ({
        ...prev,
        quote: {
          ...prev.quote,
          [key]: value,
        },
      }));
    } else {
      setBody((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fieldsToSplit = [
      "features",
      "useCases",
      "certifications",
      "patents",
      "achievements",
    ];

    const finalData = { ...body };
    fieldsToSplit.forEach((key) => {
      if (finalData[key]) {
        finalData[key] = finalData[key].split(",").map((item: string) => item.trim());
      }
    });

    if (image) finalData.image = image;

    mutation.mutate(finalData);
    setOpen(false);
    alert("Exhibition added successfully!");
  };

  return (
    <div className="add">
      <div className="modal">
        <span className="close" onClick={() => setOpen(false)}>X</span>
        <h1>Add new {slug.title}</h1>
        <form onSubmit={handleSubmit}>
          <div className="item">
            <label>Cover Image</label>
            <input type="file" accept="image/*" onChange={handleFileSelect} />
          </div>

          {columns.filter(col => col.field !== "id").map((column, index) => (
            <div className="item" key={index}>
              <label>{column.headerName}</label>
              <input
                name={column.field}
                type={column.type}
                placeholder={column.headerName}
                onChange={updateData}
              />
            </div>
          ))}

          <h4>Company Information</h4>
          <input type="text" name="company.name" placeholder="Company Name" onChange={updateData} />
          <input type="text" name="company.logo" placeholder="Logo URL" onChange={updateData} />
          <input type="text" name="company.website" placeholder="Website" onChange={updateData} />
          <input type="text" name="company.location" placeholder="Location" onChange={updateData} />
          <input type="number" name="company.foundedYear" placeholder="Founded Year" onChange={updateData} />
          <textarea name="company.background" placeholder="Background" onChange={updateData} />

          <h4>Quote</h4>
          <input type="text" name="quote.by" placeholder="By" onChange={updateData} />
          <textarea name="quote.text" placeholder="Quote Text" onChange={updateData} />

          <textarea name="features" placeholder="Features (comma-separated)" onChange={updateData} />
          <textarea name="useCases" placeholder="Use Cases (comma-separated)" onChange={updateData} />
          <input type="text" name="targetMarket" placeholder="Target Market" onChange={updateData} />
          <textarea name="certifications" placeholder="Certifications (comma-separated)" onChange={updateData} />
          <textarea name="patents" placeholder="Patents (comma-separated)" onChange={updateData} />
          <input type="text" name="researchPartner" placeholder="Research Partner" onChange={updateData} />
          <input type="text" name="videoUrl" placeholder="Video URL" onChange={updateData} />
          <input type="text" name="link" placeholder="External Link" onChange={updateData} />
          <textarea name="achievements" placeholder="Achievements (comma-separated)" onChange={updateData} />

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default AddExhibition;
