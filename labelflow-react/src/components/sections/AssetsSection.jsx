import React, { useState, useRef } from "react";

const initialAssets = [
  { name: "Luna Nova - Summer Vibes.wav", type: "audio", size: "45 MB", date: "Dec 12, 2024" },
  { name: "Alex Chen - Cover Art.png", type: "image", size: "2.3 MB", date: "Dec 10, 2024" },
  { name: "Summer Vibes - Music Video.mp4", type: "video", size: "1.2 GB", date: "Dec 8, 2024" },
  { name: "Contract Template - Artist.pdf", type: "document", size: "340 KB", date: "Dec 5, 2024" },
  { name: "Label Logo Pack.zip", type: "image", size: "8.7 MB", date: "Dec 1, 2024" },
  { name: "Midnight Dreams - Mix.mp3", type: "audio", size: "12 MB", date: "Nov 28, 2024" },
];

const iconMap = { audio: "fa-music", image: "fa-image", video: "fa-video", document: "fa-file-alt" };

function guessType(name) {
  const ext = name.split(".").pop().toLowerCase();
  if (["mp3","wav","flac","aac","ogg"].includes(ext)) return "audio";
  if (["jpg","jpeg","png","gif","webp","svg","zip"].includes(ext)) return "image";
  if (["mp4","mov","avi","mkv","webm"].includes(ext)) return "video";
  return "document";
}

export default function AssetsSection() {
  const [assets, setAssets] = useState(initialAssets);
  const [filter, setFilter] = useState("all");
  const fileInputRef = useRef(null);

  const filtered = filter === "all" ? assets : assets.filter(a => a.type === filter);

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAssets = files.map(f => ({
      name: f.name,
      type: guessType(f.name),
      size: f.size > 1e9 ? `${(f.size/1e9).toFixed(1)} GB` : f.size > 1e6 ? `${(f.size/1e6).toFixed(1)} MB` : `${Math.round(f.size/1024)} KB`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    }));
    setAssets(a => [...newAssets, ...a]);
    e.target.value = "";
  };

  const removeAsset = (name) => setAssets(a => a.filter(x => x.name !== name));

  return (
    <section id="assets" className="content-section active">
      <div className="section-header">
        <div>
          <h1>Asset Management</h1>
          <p>Organize and distribute your creative files</p>
        </div>
        <div className="header-actions-group">
          <button className="btn-secondary" onClick={() => {
            const csv = "Name,Type,Size,Date\n" + assets.map(a => `"${a.name}",${a.type},${a.size},${a.date}`).join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a"); a.href = url; a.download = "labelflow-assets.csv"; a.click();
          }}><i className="fas fa-download"></i> Download All</button>
          <button className="btn-primary" onClick={() => fileInputRef.current?.click()}>
            <i className="fas fa-upload"></i> Upload Assets
          </button>
          <input ref={fileInputRef} type="file" multiple className="upload-input" onChange={handleUpload} />
        </div>
      </div>
      <div className="asset-filters">
        {["all", "audio", "image", "video", "document"].map(f => (
          <button key={f} className={`filter-btn${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1) + "s"}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="empty-state" style={{ marginTop: "3rem" }}>
          <i className="fas fa-folder-open"></i>
          <h3>No {filter !== "all" ? filter + " " : ""}assets yet</h3>
          <p>Upload some files to get started</p>
        </div>
      ) : (
        <div className="assets-grid">
          {filtered.map((asset, i) => (
            <div className="asset-card" key={i}>
              <div className="asset-icon"><i className={`fas ${iconMap[asset.type] || "fa-file"}`}></i></div>
              <div className="asset-info">
                <h4>{asset.name}</h4>
                <p>{asset.size} · {asset.date}</p>
              </div>
              <div className="asset-actions">
                <button className="btn-icon" title="Download"><i className="fas fa-download"></i></button>
                <button className="btn-icon" title="Share"><i className="fas fa-share"></i></button>
                <button className="btn-icon" title="Delete" onClick={() => removeAsset(asset.name)} style={{ color: "#ff6b6b" }}><i className="fas fa-trash"></i></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
