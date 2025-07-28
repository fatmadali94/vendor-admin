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

const AddPodcast = (props: Props) => {
  const { slug } = props;

  const [image, setImage] = useState<string | null>(null);
  const [audio, setAudio] = useState<string | null>(null);
  const [topics, setTopics] = useState<{ topic: string }[]>([]);
  const [body, setBody] = useState<any>({});
  const [sponsors, setSponsors] = useState<{ name: string; images: string[] }[]>([]);
  const [narrator, setNarrator] = useState<{ name: string; images: string[] }[]>([]);
  const [description, setDescription] = useState('');

  const queryClient = useQueryClient();

  const createItem = async (body: any) => {
    return axios
        .post(`${import.meta.env.VITE_APP_URL}/api/podcasts`, body)
      .then((res) => res.data);
  };

  const mutation = useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries([`${slug.title}`], { exact: true });
    },
  });

  const updateData = (e: any) => {
    const { name, type, value, checked } = e.target;
    setBody((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
        const result = reader.result as string;
        if (type === "audio") {
          console.log("✅ Audio base64 preview:", result.substring(0, 100));
          setAudio(result);
        } else if (type === "image") {
          console.log("🖼️ Image base64 preview:", result.substring(0, 100));
          setImage(result);
        }
      };
  };
  
  
  const handleArrayImages = (files: FileList): Promise<string[]> => {
    const promises = Array.from(files).map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => resolve(reader.result as string);
      });
    });
    return Promise.all(promises);
  };

  const handleGroupChange = (
    group: string,
    index: number,
    field: string,
    value: any
  ) => {
    const targetGroup = group === "sponsors" ? sponsors : narrator;
    const updated = [...targetGroup];

    if (field === "name") {
      updated[index].name = value;
    } else if (field === "images" && value instanceof FileList) {
      handleArrayImages(value).then((images) => {
        updated[index].images = [...updated[index].images, ...images];
        group === "sponsors" ? setSponsors(updated) : setNarrator(updated);
      });
    }

    group === "sponsors" ? setSponsors(updated) : setNarrator(updated);
  };

  const addGroupItem = (group: string) => {
    const newItem = { name: "", images: [] };
    group === "sponsors"
      ? setSponsors([...sponsors, newItem])
      : setNarrator([...narrator, newItem]);
  };



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const finalData = {
      ...body,
      slug: body.title?.toLowerCase().replace(/\s+/g, "-"),
      image,
      audio,
      topics,
      sponsors,
      narrator,
      description,
    };

    mutation.mutate(finalData);
    props.setOpen(false);
    alert("Podcast added successfully!");
    console.log("🚀 Final audio to submit:", audio?.substring(0, 100));    
  };

  return (
    <div className="add">
      <div className="modal">
        <span className="close" onClick={() => props.setOpen(false)}>X</span>
        <h1>Add new {slug.title}</h1>

        <form onSubmit={handleSubmit}>
          <div className="item">
            <label>Cover Image</label>
            <input type="file" accept="image/*" onChange={(e) => handleFileSelect(e, "image")} />
          </div>

          <div className="item">
            <label>Audio File</label>
            <input type="file" accept="audio/*" onChange={(e) => handleFileSelect(e, "audio")} />
          </div>

          {props.columns.map((column, index) => {
            if (column.field === "id") return null;
            return (
              <div className="item" key={index}>
                <label>{column.headerName}</label>
                <input
                  name={column.field}
                  type={column.type}
                  placeholder={column.headerName}
                  onChange={updateData}
                />
              </div>
            );
          })}

          {/* ✅ Topics Section */}
          <div className="item">
            <label>Topics</label>
            {topics.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
                <input
                  type="text"
                  placeholder="Topic"
                  value={t.topic}
                  onChange={(e) => {
                    const newTopics = [...topics];
                    newTopics[i].topic = e.target.value;
                    setTopics(newTopics);
                  }}
                  style={{ flex: 1 }}
                />
                <button type="button" onClick={() => setTopics(topics.filter((_, index) => index !== i))}>
                  ✕
                </button>
              </div>
            ))}
            <button type="button" onClick={() => setTopics([...topics, { topic: "" }])}>
              + Add Topic
            </button>
          </div>

          {/* ✅ Sponsors Section */}
          <div className="group">
            <label>Sponsors</label>
            {sponsors.map((s, i) => (
              <div key={i}>
                <input
                  type="text"
                  placeholder="Sponsor Name"
                  value={s.name}
                  onChange={(e) => handleGroupChange("sponsors", i, "name", e.target.value)}
                />
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleGroupChange("sponsors", i, "images", e.target.files)}
                />
                <button type="button" onClick={() => setSponsors(sponsors.filter((_, idx) => idx !== i))}>
                  ✕ Remove Sponsor
                </button>
              </div>
            ))}
            <button type="button" onClick={() => addGroupItem("sponsors")}>+ Add Sponsor</button>
          </div>

          {/* ✅ Narrators Section */}
          <div className="group">
            <label>Narrators</label>
            {narrator.map((n, i) => (
              <div key={i}>
                <input
                  type="text"
                  placeholder="Narrator Name"
                  value={n.name}
                  onChange={(e) => handleGroupChange("narrator", i, "name", e.target.value)}
                />
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleGroupChange("narrator", i, "images", e.target.files)}
                />
                <button type="button" onClick={() => setNarrator(narrator.filter((_, idx) => idx !== i))}>
                  ✕ Remove Narrator
                </button>
              </div>
            ))}
            <button type="button" onClick={() => addGroupItem("narrator")}>+ Add Narrator</button>
          </div>
          <div className="item">
                <label>description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target. value)}
                  style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc", height: "80px" }}
                />
              </div>

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default AddPodcast;
