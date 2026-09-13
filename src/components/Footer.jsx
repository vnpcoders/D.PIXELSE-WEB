import Reveal from "./Reveal.jsx"

// Har social link ka naam + apna URL yahan daalein — jo bhi link doge,
// wahi is array me update kar dena, icon ke saath turant dikhne lagega.
const socialLinks = [
  {
    name: "Instagram",
    handle: "@d.pixelss",
    url: "https://www.instagram.com/d.pixelss?stkn=bWM2aTY0bW5lcjkx&utm_source=qr",
    icon: (
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    handle: "D.PIXELSS Films",
    url: "https://youtube.com/", // <- yahan apna real YouTube channel link daalein
    icon: (
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
        <path d="M10.5 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "Pinterest",
    handle: "D.PIXELSS",
    url: "https://pinterest.com/", // <- yahan apna real Pinterest link daalein
    icon: (
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 17c1-3 1.2-4.4 1.2-4.4M12.2 12.5c-.4-1.6.3-3 2-3 1.3 0 2 .9 2 2.1 0 1.6-1 3.5-2.3 3.5-.7 0-1.3-.4-1.5-1" />
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <>
      <section className="about-block">
        <Reveal as="h2">
          At D.Pixelss, we turn your special <em>moments</em> into timeless memories.
        </Reveal>
        <Reveal as="p" delay={100}>
          From weddings and pre-wedding shoots to portraits, fashion, events, and candid
          photography, we capture every emotion, detail, and story with creativity and
          precision. With a passion for beautiful visuals and a cinematic approach,
          D.Pixelss makes every frame worth remembering.
        </Reveal>
      </section>

      <section className="contact-band">
        <Reveal as="h3">Contact</Reveal>
        <Reveal className="contact-row" delay={80}>
          <div><span>Phone</span>+91 7000189652</div>
          <div><span>Email</span>Rakeshpathak48808@gmail.com</div>
          <div><span>Studio</span>Dewas, Madhya Pradesh</div>
        </Reveal>
        <Reveal className="social-row" delay={140}>
          {socialLinks.map((s) => (
            <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer">
              {s.icon}
              {s.name}
            </a>
          ))}
        </Reveal>
      </section>

      <footer className="footer-bar">
        © {new Date().getFullYear()} D.PIXELSS Studio
      </footer>
    </>
  )
}
