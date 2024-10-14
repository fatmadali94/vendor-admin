import React from "react";
import "./ShowFiles.css";
import "./ShowFiles.scss";

const pdfDefault = "/pdf-default.png";

const ShowFiles = (props: any) => {
  const { uploadedFiles, setFilesOpen } = props;
  console.log("uploadedFiles", uploadedFiles);

  const downloadFile = async (fileUrl: any, filename: any) => {
    try {
      // Fetch the file from the URL
      const response = await fetch(fileUrl);
      const blob = await response.blob(); // Convert to a Blob

      // Create a temporary link element to trigger download
      const link = document.createElement("a");
      const url = window.URL.createObjectURL(blob); // Create URL from Blob
      link.href = url;
      link.setAttribute("download", filename); // Set the filename for download
      document.body.appendChild(link);
      link.click(); // Trigger the download
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url); // Clean up URL object
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <div className="add">
      <div className="modal">
        <span className="close" onClick={() => setFilesOpen(false)}>
          X
        </span>
        {uploadedFiles.length > 0 ? (
          <div className="max-w-4xl mx-auto  px-4 border border-slate-300 rounded-2xl p-10">
            <h2 style={{ paddingBottom: "30px" }}>فایل های بارگزاری شده </h2>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {uploadedFiles.map((file: any) => {
                const fileType = file?.fileType?.toLowerCase();

                // Show only JPEG or PDF files
                if (
                  fileType === "jpeg" ||
                  fileType === "jpg" ||
                  fileType === "png"
                ) {
                  return (
                    <div
                      key={file._id}
                      className="bg-white shadow-2xl rounded-lg p-6 flex justify-between max-h-50"
                    >
                      <div className="text-center text-gray-700 font-semibold">
                        <p> {file.originalFilename}</p>
                      </div>
                      <div className="text-center mt-4">
                        <button
                          onClick={() =>
                            downloadFile(
                              file.url,
                              `${file.originalFilename}.${fileType}`
                            )
                          } // Trigger download
                        >
                          Download Image
                        </button>
                      </div>
                    </div>
                  );
                } else if (fileType === "pdf") {
                  return (
                    <div
                      key={file._id}
                      className="bg-white shadow-2xl  rounded-lg p-6 flex  justify-between max-h-50 "
                    >
                      {/* <img src={pdfDefault} alt="" className="w-10 h-10" /> */}
                      <div className="text-center text-gray-700 font-semibold">
                        <p>{file.originalFilename}</p>
                      </div>
                      <div className="text-center mt-4">
                        <button
                          onClick={() =>
                            downloadFile(
                              file.url,
                              `${file.originalFilename}.pdf`
                            )
                          } // Download PDF
                          className="text-blue-500 hover:underline font-semibold"
                        >
                          Download PDF
                        </button>
                      </div>
                    </div>
                  );
                }

                // Skip files that are not JPEG or PDF
                return null;
              })}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto  px-4 border border-slate-300 rounded-2xl p-10">
            <h2 className="text-xl  text-center text-red-800 mb-6">
              هیچ فایلی از سمت شما بارگزاری نشده است
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowFiles;
