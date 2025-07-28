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

const AddDigitalMagazine = (props: Props) => {
    const { slug } = props;
    const [image, setImage] = useState<any>(null);
    const [topics, setTopics] = useState<{ topic: string; page: number }[]>([]);
    const [pdf, setPdf] = useState<any>(null);
    const [pages, setPages] = useState<number[]>([]); // ✅ Added Page Numbers Array
    const [advertisements, setAdvertisements] = useState<any[]>([]);
    const [editorial, setEditorial] = useState<{ name: string; text: string; image: any }>({
      name: "",
      text: "",
      image: null,
    });
    const [body, setBody] = useState<any>({});
    const [collectors, setCollectors] = useState<{ name: string; images: any[] }[]>([]);
  

  const queryClient = useQueryClient();
  const createItem = async (body: any) => {
    return axios
      .post(`${import.meta.env.VITE_APP_URL}/api/digitalMagazines`, body) // ✅ Ensure correct route
      .then((res) => res.data);
  };
  

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
  
      // ✅ Handle Single File Uploads
      if (type === "image" || type === "pdf" || type === "editorialImage") {
        const file = files[0]; // Only take the first file
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          if (type === "image") setImage(reader.result as string); // ✅ Cover Image
          if (type === "pdf") setPdf(reader.result as string); // ✅ PDF File
          if (type === "editorialImage") {
            setEditorial((prev) => ({ ...prev, image: reader.result as string })); // ✅ Editorial Image (Fixed)
          }
        };
      }
  
      // ✅ Handle Multiple File Uploads (Advertisements, Collectors)
      if (type === "advertisements") {
        const fileReaders = files.map((file) => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => resolve(reader.result as string);
          });
        });
  
        Promise.all(fileReaders).then((fileData) => {
          setAdvertisements((prev) => [...prev, ...fileData]); // ✅ Advertisements (Multiple)
        });
      }
    }
  };
  
  // const setFileToBase = (file: any, type: string) => {
  //   const reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onloadend = () => {
  //     if (type === "image") setImage(reader.result);
  //     if (type === "pdf") setPdf(reader.result);
  //     if (type === "editorialImage") setEditorial((prev) => ({ ...prev, image: reader.result })); // ✅ Update editorial image
  //     if (type === "advertisements") setAdvertisements((prev) => [...prev, reader.result]);
  //   };
  // };
  

  const handleCollectorChange = (index: number, field: string, value: any) => {
    setCollectors((prevCollectors) => {
      const updatedCollectors = [...prevCollectors];
  
      if (field === "name") {
        updatedCollectors[index].name = value;
      } else if (field === "images" && value instanceof FileList) {
        const filesArray = Array.from(value);
  
        // ✅ Convert images to Base64
        const imagePromises = filesArray.map((file) => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => resolve(reader.result as string);
          });
        });
  
        Promise.all(imagePromises).then((imageData) => {
          // ✅ Prevent duplicate images
          updatedCollectors[index].images = Array.from(new Set([...updatedCollectors[index].images, ...imageData]));
          setCollectors(updatedCollectors);
        });
      }
      return updatedCollectors;
    });
  };  

  const addCollector = () => {
    setCollectors([...collectors, { name: "", images: [] }]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const finalData = {
      ...body,
      slug: body.title && typeof body.title === "string"
      ? body.title.toLowerCase().replace(/\s+/g, "-")
      : undefined, // ✅ Ensure a valid string or `undefined`
      image,
      pdf,
      advertisements,
      pages, // ✅ Added Pages Array to Final Data
      editorial, 
      topics, 
      collectors,
    };
  
    console.log("📌 Final Data Before Submitting:", finalData); // ✅ Check if everything is correct
    mutation.mutate(finalData);
    props.setOpen(false);
    alert("Digital Magazine added successfully!");
  };
  
  


  return (
    <div className="add">
      <div className="modal">
        <span className="close" onClick={() => props.setOpen(false)}>X</span>
        <h1>Add new {props.slug.title}</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="item">
            <label>Cover Image</label>
            <input type="file" onChange={(e) => handleFileSelect(e, "image")} />
          </div>

          <div className="item">
            <label>Magazine PDF</label>
            <input type="file" accept="application/pdf" onChange={(e) => handleFileSelect(e, "pdf")} />
          </div>

          {props.columns
            .filter((item) => item.field !== "id" && item.field !== "img")
            .map((column, index) => {
              switch (column.type) {
                case "text":
                case "number":
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
                case "checkbox":
                  return (
                    <div className="item" key={index}>
                      <label>{column.headerName}</label>
                      <input name={column.field} type="checkbox" onChange={updateData} />
                    </div>
                  );
                default:
                  return null;
              }
            })}

<div style={{ 
  border: "2px solid #ccc", 
  padding: "15px", 
  margin: "10px 0", 
  borderRadius: "8px", 
  boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)"
}}>
  <p style={{ marginBottom: "10px" }}>Advertisements</p>

  <input 
    type="file" 
    multiple 
    onChange={(e) => handleFileSelect(e, "advertisements")}
    style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
  />

  {advertisements.length > 0 && (
    <div style={{ marginTop: "10px" }}>
      {advertisements.map((_, index) => (
        <div key={index} style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px" }}>
          <span style={{ flex: 1 }}>Advertisement {index + 1}</span>
          <button 
            type="button" 
            onClick={() => setAdvertisements((prev) => prev.filter((_, i) => i !== index))} 
            style={{ backgroundColor: "red", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )}
</div>
               {/* ✅ Input for Page Numbers */}
               <div className="item">
            <label>Page Numbers (For Blurring)</label>
            <input
              type="text"
              placeholder="Enter comma-separated page numbers (e.g., 2, 5, 10)"
              onChange={(e) => {
                const pageNumbers = e.target.value
                  .split(",")
                  .map((num) => parseInt(num.trim()))
                  .filter((num) => !isNaN(num));
                setPages(pageNumbers);
              }}
            />
          </div>

          {/* ✅ Topics Input */}
          <div className="item">
            <label>Topics</label>
            {topics.map((t, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Topic"
                  value={t.topic}
                  onChange={(e) => {
                    const newTopics = [...topics];
                    newTopics[index].topic = e.target.value;
                    setTopics(newTopics);
                  }}
                  className="border rounded px-2 py-1"
                />
                <input
                  type="number"
                  placeholder="Page"
                  value={t.page}
                  onChange={(e) => {
                    const newTopics = [...topics];
                    newTopics[index].page = Number(e.target.value);
                    setTopics(newTopics);
                  }}
                  className="border rounded px-2 py-1 w-20"
                />
                <button
                  type="button"
                  onClick={() => setTopics(topics.filter((_, i) => i !== index))}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setTopics([...topics, { topic: "", page: 1 }])}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
            >
              + Add Topic
            </button>
          </div>

                      <div style={{ 
              border: "2px solid #ccc", 
              padding: "15px", 
              margin: "10px 0", 
              borderRadius: "8px", 
              boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)"
            }}>
              <div className="item">
                <label>Editorial Name</label>
                <input 
                  type="text" 
                  value={editorial.name} 
                  onChange={(e) => setEditorial((prev) => ({ ...prev, name: e.target.value }))} 
                  style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
                />
              </div>

              <div className="item">
                <label>Editorial Text</label>
                <textarea
                  value={editorial.text}
                  onChange={(e) => setEditorial((prev) => ({ ...prev, text: e.target.value }))}
                  style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc", height: "80px" }}
                />
              </div>

              <div className="item">
                <label>Editorial Image</label>
                <input 
                  type="file" 
                  onChange={(e) => handleFileSelect(e, "editorialImage")} 
                  style={{ padding: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
                />
              </div>
            </div>

            <div style={{ 
              border: "2px solid #ccc", 
              padding: "15px", 
              margin: "10px 0", 
              borderRadius: "8px", 
              boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)"
            }}>
              <h3 style={{ marginBottom: "10px" }}>Collectors</h3>

              {collectors.map((collector, index) => (
                <div key={index} style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "10px" }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <input 
                      type="text" 
                      placeholder="Collector Name"
                      value={collector.name}
                      onChange={(e) => handleCollectorChange(index, "name", e.target.value)}
                      style={{ width: "70%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
                    />
                    <button 
                      type="button" 
                      onClick={() => setCollectors(collectors.filter((_, i) => i !== index))}
                      style={{ backgroundColor: "red", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" }}
                    >
                      ✕
                    </button>
                  </div>

                  <input 
                    type="file" 
                    multiple 
                    onChange={(e) => handleCollectorChange(index, "images", e.target.files)} 
                    style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
                  />
                </div>
              ))}

              <button 
                type="button" 
                onClick={addCollector} 
                style={{ marginTop: "10px", padding: "5px 10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
              >
                + Add Collector
              </button>
            </div>


          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default AddDigitalMagazine;
