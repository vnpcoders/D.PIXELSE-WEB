"use client"

import { useEffect, useRef, useState } from "react"
import { supabase } from "../../lib/supabaseClient.js"

function LoginForm({ onLoggedIn }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError("Login galat hai — email/password check karein.")
      return
    }
    onLoggedIn()
  }

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <form className="form-card glass" style={{ maxWidth: 380, width: "100%" }} onSubmit={onSubmit}>
        <h2 style={{ marginBottom: 20, fontSize: "1.4rem" }}>Admin Login</h2>
        <div className="field">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button className="btn btn-solid" type="submit" disabled={loading}>
          {loading ? "Checking..." : "Login"}
        </button>
        {error && <div className="form-status err">{error}</div>}
      </form>
    </div>
  )
}

const selectStyle = {
  width: "100%",
  padding: "13px 16px",
  borderRadius: 12,
  border: "1px solid var(--glass-border)",
  background: "var(--input-bg)",
  color: "var(--text)",
  colorScheme: "light",
}

function UploadForm({ onUploaded }) {
  const [type, setType] = useState("photo")
  const [caption, setCaption] = useState("")
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState({ state: "idle", msg: "" })
  const fileInput = useRef(null)

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!file) return

    setStatus({ state: "loading", msg: "Uploading..." })

    try {
      const ext = file.name.split(".").pop()
      const path = `${type}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadError } = await supabase.storage.from("media").upload(path, file)
      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage.from("media").getPublicUrl(path)

      const { error: insertError } = await supabase.from("media").insert({
        type,
        url: publicUrlData.publicUrl,
        caption,
      })
      if (insertError) throw insertError

      setStatus({ state: "ok", msg: "Upload ho gaya!" })
      setCaption("")
      setFile(null)
      if (fileInput.current) fileInput.current.value = ""
      onUploaded()
    } catch (err) {
      setStatus({ state: "err", msg: "Upload fail hua: " + err.message })
    }
  }

  return (
    <form className="form-card glass" onSubmit={onSubmit} style={{ marginBottom: 40 }}>
      <h3 style={{ marginBottom: 16, fontSize: "1.2rem" }}>Naya media add karein</h3>
      <div className="field">
        <label>Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)} style={selectStyle}>
          <option value="photo">Photo</option>
          <option value="video">Video</option>
          <option value="reel">Reel (home page slider)</option>
        </select>
      </div>
      <div className="field">
        <label>Caption / Title</label>
        <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="e.g. Wedding shoot, Aisha & Rohan" />
      </div>
      <div className="field">
        <label>File ({type === "photo" ? "image" : "video"})</label>
        <input
          ref={fileInput}
          type="file"
          accept={type === "photo" ? "image/*" : "video/*"}
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
      </div>
      <button className="btn btn-solid" type="submit" disabled={status.state === "loading"}>
        {status.state === "loading" ? "Uploading..." : "Upload"}
      </button>
      <div className={`form-status ${status.state === "ok" ? "ok" : status.state === "err" ? "err" : ""}`}>{status.msg}</div>
    </form>
  )
}

function storagePathFromUrl(url) {
  const marker = "/object/public/media/"
  const idx = url.indexOf(marker)
  return idx === -1 ? null : url.slice(idx + marker.length)
}

function EditForm({ item, onDone, onCancel }) {
  const [caption, setCaption] = useState(item.caption || "")
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState({ state: "idle", msg: "" })

  const onSave = async (e) => {
    e.preventDefault()
    setStatus({ state: "loading", msg: "Saving..." })

    try {
      let newUrl = item.url

      if (file) {
        const ext = file.name.split(".").pop()
        const path = `${item.type}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error: uploadError } = await supabase.storage.from("media").upload(path, file)
        if (uploadError) throw uploadError

        const { data: publicUrlData } = supabase.storage.from("media").getPublicUrl(path)
        newUrl = publicUrlData.publicUrl

        // remove the old file from storage so it doesn't sit there unused
        const oldPath = storagePathFromUrl(item.url)
        if (oldPath) await supabase.storage.from("media").remove([oldPath])
      }

      // Same row id is kept, so its position/order does not change.
      const { error: updateError } = await supabase
        .from("media")
        .update({ caption, url: newUrl })
        .eq("id", item.id)
      if (updateError) throw updateError

      onDone()
    } catch (err) {
      setStatus({ state: "err", msg: "Update fail hua: " + err.message })
    }
  }

  return (
    <form onSubmit={onSave} style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
      <input
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Caption"
        style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.1)", color: "#fff", fontSize: "0.8rem" }}
      />
      <input
        type="file"
        accept={item.type === "photo" ? "image/*" : "video/*"}
        onChange={(e) => setFile(e.target.files[0])}
        style={{ fontSize: "0.72rem", color: "#fff" }}
      />
      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn" type="submit" disabled={status.state === "loading"}>
          {status.state === "loading" ? "Saving..." : "Save"}
        </button>
        <button className="btn" type="button" onClick={onCancel}>Cancel</button>
      </div>
      {status.state === "err" && <div className="form-status err">{status.msg}</div>}
    </form>
  )
}

function MediaList({ items, onChanged }) {
  const [editingId, setEditingId] = useState(null)

  const onDelete = async (item) => {
    if (!confirm("Pakka delete karna hai?")) return
    const path = storagePathFromUrl(item.url)
    if (path) await supabase.storage.from("media").remove([path])
    await supabase.from("media").delete().eq("id", item.id)
    onChanged()
  }

  return (
    <div className="grid grid-mosaic">
      {items.map((item) => (
        <div className="card" key={item.id} style={{ cursor: "default" }}>
          {item.type === "photo" ? (
            <img src={item.url} alt={item.caption} />
          ) : (
            <video src={item.url} muted preload="metadata" />
          )}
          <div className="card-caption" style={{ opacity: 1 }}>
            {editingId === item.id ? (
              <EditForm
                item={item}
                onDone={() => { setEditingId(null); onChanged() }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <span>{item.caption || item.type}</span>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button className="btn" onClick={() => setEditingId(item.id)}>Update</button>
                  <button className="btn danger" onClick={() => onDelete(item)}>Delete</button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function LeadsList() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false })
    setLeads(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const onDelete = async (id) => {
    if (!confirm("Ye enquiry delete karni hai?")) return
    await supabase.from("leads").delete().eq("id", id)
    load()
  }

  if (loading) return <p>Loading...</p>
  if (leads.length === 0) return <p>Abhi tak koi contact form submission nahi aayi.</p>

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {leads.map((lead) => (
        <div key={lead.id} className="form-card glass" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <strong style={{ fontFamily: "var(--serif)", fontSize: "1.1rem" }}>{lead.name || "(no name)"}</strong>
              <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: 4 }}>
                {lead.email} {lead.phone && `· ${lead.phone}`}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
                {new Date(lead.created_at).toLocaleString()}
              </span>
              <button className="btn" style={{ padding: "6px 12px", fontSize: "0.75rem" }} onClick={() => onDelete(lead.id)}>
                Delete
              </button>
            </div>
          </div>
          {lead.message && <p style={{ marginTop: 12 }}>{lead.message}</p>}
        </div>
      ))}
    </div>
  )
}

function Dashboard() {
  const [tab, setTab] = useState("media")
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from("media").select("*").order("created_at", { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  return (
    <div>
      <div className="section-head" style={{ marginTop: 0 }}>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: "2rem" }}>Admin Panel</h1>
        <button className="btn" onClick={signOut}>Logout</button>
      </div>

      <div style={{ display: "flex", gap: 10, margin: "24px 0" }}>
        <button className={`btn ${tab === "media" ? "btn-solid" : ""}`} onClick={() => setTab("media")}>
          Media
        </button>
        <button className={`btn ${tab === "leads" ? "btn-solid" : ""}`} onClick={() => setTab("leads")}>
          Contact leads
        </button>
      </div>

      {tab === "media" ? (
        <>
          <UploadForm onUploaded={load} />
          <h3 style={{ margin: "20px 0" }}>Sab media ({items.length})</h3>
          {loading ? <p>Loading...</p> : items.length === 0 ? <p>Abhi tak kuch upload nahi hua.</p> : <MediaList items={items} onChanged={load} />}
        </>
      ) : (
        <LeadsList />
      )}
    </div>
  )
}

export default function AdminPage() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setSession(session))
    return () => listener.subscription.unsubscribe()
  }, [])

  if (session === undefined) return null
  if (!session) return <LoginForm onLoggedIn={() => { }} />
  return <Dashboard />
}
