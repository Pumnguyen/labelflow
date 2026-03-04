import React, { useState } from "react";

const initialCampaigns = [
  {
    title: "Summer Vibes EP Launch",
    artist: "Luna Nova",
    status: "active",
    budget: "$5,000",
    spent: "$2,800",
    progress: 65,
    reach: "125K",
    engagement: "8.2%",
    streams: "45K",
    platforms: ["spotify", "instagram", "tiktok"],
  },
  {
    title: "Electronic Dreams Tour",
    artist: "Alex Chen",
    status: "planning",
    budget: "$15,000",
    spent: "$3,200",
    progress: 25,
    reach: "89K",
    engagement: "6.8%",
    streams: "234",
    platforms: ["youtube", "instagram"],
  },
  {
    title: "Midnight Waves Single",
    artist: "The Midnight",
    status: "active",
    budget: "$3,500",
    spent: "$1,100",
    progress: 40,
    reach: "67K",
    engagement: "9.1%",
    streams: "28K",
    platforms: ["spotify", "tiktok"],
  },
];

const BLANK = { title: "", artist: "", status: "planning", budget: "", platforms: [] };
const PLATFORM_OPTIONS = ["spotify", "apple-music", "youtube", "instagram", "tiktok", "twitter"];

export default function CampaignsSection() {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [editIndex, setEditIndex] = useState(null);

  const openNew = () => { setForm(BLANK); setEditIndex(null); setShowModal(true); };
  const openEdit = (i) => { setForm({ ...campaigns[i] }); setEditIndex(i); setShowModal(true); };

  const togglePlatform = (p) => {
    setForm(f => ({
      ...f,
      platforms: f.platforms.includes(p) ? f.platforms.filter(x => x !== p) : [...f.platforms, p],
    }));
  };

  const save = () => {
    if (!form.title.trim()) return;
    const entry = {
      ...form,
      budget: form.budget || "$0",
      spent: "$0",
      progress: 0,
      reach: "0",
      engagement: "0%",
      streams: "0",
    };
    if (editIndex !== null) {
      setCampaigns(cs => cs.map((c, i) => i === editIndex ? { ...c, ...entry } : c));
    } else {
      setCampaigns(cs => [entry, ...cs]);
    }
    setShowModal(false);
  };

  const remove = (i) => setCampaigns(cs => cs.filter((_, j) => j !== i));

  return (
    <section id="campaigns" className="content-section active">
      <div className="section-header">
        <div>
          <h1>Marketing Campaigns</h1>
          <p>Plan, execute, and measure impact</p>
        </div>
        <button className="btn-primary" onClick={openNew}><i className="fas fa-plus"></i> New Campaign</button>
      </div>

      <div className="campaigns-list">
        {campaigns.map((c, i) => (
          <div className="campaign-card" key={i}>
            <div className="campaign-header">
              <h3>{c.title}</h3>
              <span className={`status ${c.status}`}>{c.status}</span>
            </div>
            <p className="campaign-artist">Artist: {c.artist}</p>
            <div className="campaign-metrics">
              <span><i className="fas fa-eye"></i> {c.reach} reach</span>
              <span><i className="fas fa-heart"></i> {c.engagement} engagement</span>
              <span><i className="fas fa-play"></i> {c.streams} streams</span>
            </div>
            <div className="campaign-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${c.progress}%` }}></div>
              </div>
              <span>{c.progress}%</span>
            </div>
            <div className="campaign-budget" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Budget: {c.budget} | Spent: {c.spent}</span>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button className="btn-icon" title="Edit" onClick={() => openEdit(i)}><i className="fas fa-edit"></i></button>
                <button className="btn-icon" title="Delete" onClick={() => remove(i)} style={{ color: "#ff6b6b" }}><i className="fas fa-trash"></i></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editIndex !== null ? "Edit Campaign" : "New Campaign"}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}><i className="fas fa-times"></i></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Campaign Title *</label>
                <input className="form-input" placeholder="e.g. Summer Vibes EP Launch" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Artist</label>
                <input className="form-input" placeholder="Artist name" value={form.artist} onChange={e => setForm(f => ({ ...f, artist: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Budget</label>
                <input className="form-input" placeholder="e.g. $5,000" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select className="form-input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="paused">Paused</option>
                </select>
              </div>
              <div className="form-group">
                <label>Platforms</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.4rem" }}>
                  {PLATFORM_OPTIONS.map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => togglePlatform(p)}
                      className={form.platforms.includes(p) ? "btn-primary" : "btn-secondary"}
                      style={{ padding: "0.3rem 0.8rem", fontSize: "0.8rem", textTransform: "capitalize" }}
                    >{p}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={save}>{editIndex !== null ? "Save Changes" : "Create Campaign"}</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
