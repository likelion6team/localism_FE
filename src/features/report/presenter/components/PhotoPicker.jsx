import { useRef } from "react";
export default function PhotoPicker({ files = [], onChange, onReplace }) {
  const inputRef = useRef(null);
  const open = () => inputRef.current?.click();
  const onFiles = (e) => {
    const arr = Array.from(e.target.files || []);
    onChange([...files, ...arr]);
  };
  const last = files[files.length - 1];

  return (
    <div>
      {last ? (
        <>
          <div
            className="card"
            style={{ aspectRatio: "1/1", overflow: "hidden", margin: "12px 0" }}
          >
            <img
              alt="preview"
              src={URL.createObjectURL(last)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <button
            onClick={open}
            style={{
              border: "1px solid var(--line)",
              borderRadius: 999,
              padding: "6px 10px",
              background: "#fff",
            }}
          >
            사진 다시 업로드
          </button>
        </>
      ) : (
        <>
          <button className="card" onClick={open} style={btn}>
            사진 업로드
          </button>
          <button className="card" onClick={open} style={btn}>
            사진 찍기
          </button>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        hidden
        onChange={onFiles}
      />
    </div>
  );
}
const btn = {
  width: "100%",
  padding: "16px",
  margin: "8px 0",
  background: "#F3F5F8",
  border: "none",
};
