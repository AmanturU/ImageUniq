import { useCallback, useMemo, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import clsx from "clsx";

function DropzoneComponent({ upload, multiple, clearFiles, children }) {
  const [files, setFiles] = useState([]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      let newFiles = acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) }),
      );

      if (multiple) {
        // Allow multiple files, but limit the total count to 25
        const combinedFiles = [...files, ...newFiles].slice(0, 25);
        setFiles(combinedFiles);
        upload(combinedFiles);
      } else {
        // In single mode, only allow one file
        setFiles(newFiles.slice(0, 1));
        upload(newFiles.slice(0, 1));
      }
    },
    [files, multiple, upload],
  );

  // Clear the files when the `clearFiles` state is true
  useEffect(() => {
    if (clearFiles) {
      setFiles([]);
      upload([]); // Clear the uploaded files as well
    }
  }, [clearFiles, upload]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    multiple: multiple || false,
    accept: {
      "image/jpeg": [".jpg", ".jpeg", ".png"],
    },
    minSize: 0,
    maxSize: 5242880,
  });

  const thumbs = files.map((file) => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img
          src={file.preview}
          style={img}
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
      </div>
    </div>
  ));

  const style = useMemo(
    () =>
      clsx(
        "flex flex-col justify-center w-full h-[284px] items-center rounded-xl border-2 border-dashed border-[#65676B]/50 text-[#777E90] transition-border duration-300 ease-in-out cursor-pointer",
        {
          "border-accent": isDragActive,
          "border-[#00e676]": isDragAccept,
          "border-[#ff1744]": isDragReject,
        },
      ),
    [isDragActive, isDragReject, isDragAccept],
  );

  return (
    <div {...getRootProps({ className: style })}>
      <input {...getInputProps()} />
      <aside className="flex flex-wrap mt-2 overflow-auto items-center w-full justify-center gap-2">
        {thumbs}
      </aside>
      {children}
    </div>
  );
}

const thumb = {
  display: "inline-flex",
  borderRadius: 2,
  border: "1px solid #eaeaea",
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: "border-box",
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
};

const img = {
  display: "block",
  width: "auto",
  height: "100%",
};

export default DropzoneComponent;
