"use client"

import { useState } from "react"
import Footer from "../../components/Footer.jsx"
import Reveal from "../../components/Reveal.jsx"
import { supabase } from "../../lib/supabaseClient.js"

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" })
  const [status, setStatus] = useState({ state: "idle", msg: "" })

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus({ state: "loading", msg: "Sending..." })

    const { error } = await supabase.from("leads").insert({
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: form.message,
    })

    if (error) {
      setStatus({ state: "err", msg: "Kuch gadbad hui — dobara try karein ya seedha call karein." })
      return
    }

    setStatus({ state: "ok", msg: "Thank you! Aapka message mil gaya, hum jald contact karenge." })
    setForm({ name: "", email: "", phone: "", message: "" })
  }

  return (
    <>
      <section style={{ paddingBottom: 0 }}>
        <Reveal as="div" style={{ textAlign: "center", marginBottom: 40 }}>
          <div className="section-label">Get in touch</div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)" }}>Let's plan your shoot</h1>
          <p style={{ maxWidth: 480, margin: "16px auto 0" }}>
            Fill the form and we'll get back within a day — dates fill up fast for
            wedding season.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="contact-wrap">
            <form className="form-card glass" onSubmit={onSubmit}>
              <div className="field">
                <label htmlFor="name">Name</label>
                <input id="name" name="name" value={form.name} onChange={onChange} required placeholder="Your full name" />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" name="email" value={form.email} onChange={onChange} required placeholder="you@email.com" />
              </div>
              <div className="field">
                <label htmlFor="phone">Phone</label>
                <input id="phone" name="phone" value={form.phone} onChange={onChange} placeholder="+91 ..." />
              </div>
              <div className="field">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows="4" value={form.message} onChange={onChange} required placeholder="Tell us about your shoot — date, location, type" />
              </div>

              <button className="btn btn-solid" type="submit" disabled={status.state === "loading"}>
                {status.state === "loading" ? "Sending..." : "Send message"}
              </button>
              <div className={`form-status ${status.state === "ok" ? "ok" : status.state === "err" ? "err" : ""}`}>
                {status.msg}
              </div>
            </form>

            <div className="form-card glass">
              <h3 style={{ fontSize: "1.3rem", marginBottom: 16 }}>Studio details</h3>
              <div className="detail-row">📞 +91 7000189652</div>
              <div className="detail-row">✉️ Rakeshpathak48808@gmail.com</div>
              <div className="detail-row">📍 Dewas, Madhya Pradesh</div>
              <div className="detail-row">🕒 Mon–Sat, 10am – 7pm</div>
              <p style={{ marginTop: 18 }}>
                Every submission here is saved straight into our admin panel so no
                enquiry gets missed.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />
    </>
  )
}
