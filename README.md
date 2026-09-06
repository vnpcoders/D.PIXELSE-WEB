# Lens & Frame — Photographer Portfolio (Next.js + dynamic admin)

Next.js (App Router) website: glass-effect design, smooth page transitions,
reels slider on Home, click-to-zoom lightbox, aur ek **admin panel** jaha se
photographer khud photo/video **upload aur delete** kar sakta hai — koi code
touch kiye bina, live site turant update ho jati hai.

Pages: Home (`/`), Video (`/video`), Photo (`/photo`), Reels (`/reels`),
Contact (`/contact`), Admin (`/admin`).

100% FREE stack:
- **Supabase** (free tier) — database + file storage + login, media ke liye
- **Vercel** (free tier) — hosting, GitHub se connected
- **Google Sheets + Apps Script** (free) — contact form ke leads ke liye

---

## Step 1 — Supabase setup (media database + storage + admin login)

1. [supabase.com](https://supabase.com) pe free account banayein → **New
   project** banayein (koi bhi naam, region "South Asia (Mumbai)" chunein
   agar option ho).
2. Project ban jaane ke baad, left sidebar me **SQL Editor** kholein → **New
   query**.
3. Is repo ki `supabase-schema.sql` file ka pura code copy-paste karke
   **Run** karein. Isse `media` table aur security rules ban jayenge.
4. Ab left sidebar me **Storage** kholein → **New bucket** → naam bilkul
   `media` rakhein → **Public bucket** ON karein → Create.
5. Wapas **SQL Editor** me jayein, `supabase-schema.sql` file ke sabse neeche
   wale 3 storage policy wale query bhi (agar pehle skip kiye ho) run kar
   dein.
6. Left sidebar me **Authentication > Users** kholein → **Add user** → apna
   email + ek password daal ke user bana lein. Yahi email/password admin
   panel me login karne ke kaam aayenge.
7. Left sidebar me **Settings > API** kholein — yahan se do cheezein copy
   karein:
   - **Project URL**
   - **anon public** key

## Step 2 — Local setup

```
npm install
```

`.env.local.example` file ko copy karke `.env.local` banayein, aur usme
Step 1 ke Project URL + anon key paste kar dein:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Phir:

```
npm run dev
```

`http://localhost:3000` pe site khulegi, `http://localhost:3000/admin` pe
admin login.

## Step 3 — Contact form ko Google Sheet se jodna

1. `sheets.google.com` pe naya Sheet banayein.
2. **Extensions > Apps Script** kholein, is repo ki `google-apps-script.gs`
   file ka code paste karein.
3. **Deploy > New deployment > Web app** — Execute as: Me, Access: Anyone.
4. Jo URL mile, use `src/config.js` me `GOOGLE_SHEET_ENDPOINT` me paste kar
   dein.

## Step 4 — Free hosting (Vercel, GitHub se connected)

1. Is project ko GitHub pe naya repo banake push kar dein.
2. [vercel.com](https://vercel.com) pe GitHub se sign up → repo import
   karein → Next.js apne aap detect hoga.
3. **Environment Variables** section me wahi 2 Supabase values daalein
   (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
4. **Deploy** dabayein.

Free `.vercel.app` link mil jayega — ye link kisi ko bhi share kar sakte
hain. Jab bhi GitHub pe `main` branch pe push karenge, site automatically
update ho jayegi.

## Admin panel kaise use karein

`https://your-site.vercel.app/admin` pe jayein → Step 1.6 wala email/password
se login karein → "Naya media add karein" form se:
- **Type** chunein — Photo / Video / Reel (Reel wale Home page ke slider me
  dikhte hain)
- Caption/title likhein
- File choose karke **Upload** dabayein

Upload hote hi wo Home/Photo/Video/Reels page par turant dikhne lagega —
koi code change ya redeploy nahi karna padta. Delete button se hata bhi
sakte hain.

Ye login sirf aapke Supabase account se bane user tak seemित hai — koi aur
is email/password ke bina upload/delete nahi kar sakta, chahe wo `/admin`
URL kholke bhi dekh le.

## Design notes

- Glass effect: `.glass` class, `src/app/globals.css`
- Page pop-in animation: `src/app/template.jsx`
- Uniform-size cards + click-to-zoom: `src/components/Lightbox.jsx`
- Saare media (photo/video/reel) Supabase ke `media` table se live fetch
  hote hain — koi static file edit karne ki zaroorat nahi.
