import React, { useState } from "react";

const INSIGHT_POOL = [
  { icon: "fas fa-fire", text: 'Luna Nova\'s "Midnight Dreams" is trending on TikTok — 340% increase in saves this week.' },
  { icon: "fas fa-clock", text: "Optimal release window for Alex Chen: Tuesday 3–5 PM EST based on listener patterns." },
  { icon: "fas fa-globe", text: "Luna Nova fanbase surging in Berlin and Amsterdam — recommend a European tour push." },
  { icon: "fas fa-chart-line", text: "Avg. stream duration up 22% — listeners are completing tracks; prioritise playlist pitching." },
  { icon: "fas fa-dollar-sign", text: "Sync licensing revenue is 18% of total — explore more TV/ad placements for passive income." },
  { icon: "fas fa-bullseye", text: "Instagram Reels are outperforming Stories 4:1 for campaign ROI across all artists." },
  { icon: "fas fa-handshake", text: "Collaborations with mid-tier influencers (50K–200K) yielding 3× better CPM than macro." },
  { icon: "fas fa-music", text: "Friday releases consistently outperform other days by 27% for first-week streams." },
];

const activities = [
  { icon: "fas fa-upload", text: "<strong>New track uploaded</strong> by Luna Nova", time: "2 hours ago" },
  { icon: "fas fa-bullhorn", text: '<strong>Campaign launched</strong> for "Summer Vibes" EP', time: "5 hours ago" },
  { icon: "fas fa-handshake", text: "<strong>Collaboration secured</strong> with Metro FM", time: "1 day ago" },
];

const events = [
  { day: "15", month: "Dec", title: "Luna Nova - Studio Session", time: "2:00 PM" },
  { day: "18", month: "Dec", title: "Alex Chen - Music Video Shoot", time: "10:00 AM" },
  { day: "22", month: "Dec", title: "Label Meeting - Q4 Review", time: "3:00 PM" },
];

export default function DashboardSection() {
  const [insights, setInsights] = useState([
    INSIGHT_POOL[0], INSIGHT_POOL[1], INSIGHT_POOL[2],
  ]);
  const [generating, setGenerating] = useState(false);
  const [shareMsg, setShareMsg] = useState("");

  const generateInsights = () => {
    setGenerating(true);
    setTimeout(() => {
      const shuffled = [...INSIGHT_POOL].sort(() => Math.random() - 0.5).slice(0, 4);
      setInsights(shuffled);
      setGenerating(false);
    }, 1200);
  };

  const shareReport = () => {
    const text = "LabelFlow Report\n" + insights.map(i => "• " + i.text).join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setShareMsg("Report copied to clipboard!");
      setTimeout(() => setShareMsg(""), 3000);
    });
  };

  return (
    <section id="dashboard" className="content-section active">
      <div className="section-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of your label performance</p>
        </div>
        <div className="header-actions-group">
          <button className="btn-secondary" onClick={shareReport}><i className="fas fa-share"></i> Share Report</button>
          <button className="btn-primary" onClick={generateInsights} disabled={generating}>
            <i className={`fas ${generating ? "fa-spinner fa-spin" : "fa-lightbulb"}`}></i>{" "}
            {generating ? "Generating…" : "Generate Insights"}
          </button>
        </div>
      </div>
      {shareMsg && (
        <div style={{ background: "var(--success, #4caf50)", color: "#fff", padding: "0.6rem 1rem", borderRadius: "8px", marginBottom: "1rem", fontWeight: 600 }}>
          <i className="fas fa-check"></i> {shareMsg}
        </div>
      )}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-users"></i></div>
          <div className="stat-info"><h3>42</h3><p>Active Artists</p><span className="trend positive">+12%</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-bullhorn"></i></div>
          <div className="stat-info"><h3>28</h3><p>Active Campaigns</p><span className="trend positive">+8%</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-play"></i></div>
          <div className="stat-info"><h3>2.4M</h3><p>Monthly Streams</p><span className="trend positive">+24%</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-dollar-sign"></i></div>
          <div className="stat-info"><h3>$124K</h3><p>Monthly Revenue</p><span className="trend positive">+18%</span></div>
        </div>
      </div>
      <div className="dashboard-grid">
        <div className="dashboard-card recent-activity">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {activities.map((a, i) => (
              <div className="activity-item" key={i}>
                <div className="activity-icon"><i className={a.icon}></i></div>
                <div className="activity-info">
                  <p dangerouslySetInnerHTML={{ __html: a.text }} />
                  <span>{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="dashboard-card upcoming-events">
          <h3>Upcoming Events</h3>
          <div className="events-list">
            {events.map((e, i) => (
              <div className="event-item" key={i}>
                <div className="event-date">
                  <span className="day">{e.day}</span>
                  <span className="month">{e.month}</span>
                </div>
                <div className="event-info">
                  <h4>{e.title}</h4>
                  <span>{e.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="dashboard-card ai-insights">
          <h3>AI Insights</h3>
          <div className="insights-list">
            {insights.map((ins, i) => (
              <div className="insight-item" key={i}>
                <i className={ins.icon}></i>
                <p>{ins.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
