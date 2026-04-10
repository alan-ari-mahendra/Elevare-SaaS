# Dashboard Redesign — Visual Improvement Plan

## Tujuan
Mempoles tampilan dashboard agar lebih modern dan polished. Fokus ke visual, bukan fungsional.

## Aturan Penting
- **Dark/light mode DIPERTAHANKAN** di seluruh `src/app/(main)/` — tetap pakai CSS variables (`bg-background`, `text-foreground`, dll)
- Force light mode HANYA di landing page dan halaman login
- Semua perubahan di bawah ini harus tetap support dark & light mode

---

## 1. Statistics Cards — Lebih Hidup

**Masalah:** 4 card statistik plain semua, kurang visual hierarchy.

**Solusi:** Beri setiap card accent color yang berbeda lewat icon background:
- Total Projects → `bg-primary/10` icon `text-primary`
- Active Tasks → `bg-amber-500/10` icon `text-amber-500`
- Completed Tasks → `bg-emerald-500/10` icon `text-emerald-500`
- Completion Rate → `bg-violet-500/10` icon `text-violet-500`

Card tetap `bg-card`, tapi ada icon background berwarna sebagai pembeda visual.

**File:** `src/components/sections/dashboard-statistics.tsx`

---

## 2. Welcome Section — Lebih Informatif

**Masalah:** Greeting cuma "Welcome back, {name}" tanpa konteks.

**Solusi:** Tambah satu baris subtitle kecil di bawah greeting:
- "You have X active projects and Y tasks due this week"
- Tetap 1-2 baris, tidak menambah tinggi section secara signifikan

**File:** `src/app/(main)/dashboard/page.tsx`

---

## 3. Deadline Reminder — Kurang Kaku, Lebih Modern

**Masalah:** Komponen terlihat kaku dan boxy. Warna block terlalu solid dan agresif.

**Solusi:**
- Ganti dari card/alert box menjadi banner horizontal yang lebih ringan
- Pakai `border-l-4` sebagai accent warna (merah untuk overdue, amber untuk due today, emerald untuk all clear)
- Background lebih soft: `bg-red-500/5` bukan solid `bg-red-500`
- Icon lebih kecil, teks lebih compact satu baris jika memungkinkan
- Rounded corners lebih besar (`rounded-xl`)
- Hilangkan kesan "alert box" — buat lebih seperti inline notification

**File:** `src/components/sections/dashboard-deadline-reminder.tsx`

---

## 4. Recent Activity — Timeline Style

**Masalah:** Activity list cuma bullet + teks, kurang visual.

**Solusi:**
- Ganti bullet dengan vertical timeline line (garis vertikal di kiri)
- Tiap activity punya dot kecil di garis timeline
- Timestamp lebih compact (relative time: "2h ago" bukan full datetime)

**File:** `src/components/sections/dashboard-recent-activity.tsx`

---

## 5. Project Overview Cards — Lebih Polished

**Masalah:** Card project sudah lumayan tapi bisa lebih polished.

**Solusi:**
- Progress bar pakai warna sesuai persentase (primary default, emerald kalau >80%, amber <30%)
- Hover effect lebih smooth (`hover:shadow-md transition-shadow`)
- Badge status pakai pill style yang lebih subtle

**File:** `src/components/sections/dashboard-project-overview.tsx`

---

## 6. Quick Actions — Reposisi

**Masalah:** Quick actions di paling bawah, jarang terlihat.

**Solusi:** Pindah ke samping welcome section (inline, bukan section terpisah). Jadikan 3 button kecil horizontal di kanan greeting.

**File:** 
- `src/app/(main)/dashboard/page.tsx`
- `src/components/sections/dashboard-quick-actions.tsx`

---

## Urutan Pengerjaan

```
1. Statistics cards (accent colors)
2. Welcome section + Quick actions reposisi
3. Deadline reminder (redesign lebih ringan)
4. Recent activity (timeline style)
5. Project overview (polish)
```

## Prinsip

- Tidak mengubah fungsional / logic / data flow
- Tidak mengubah routing atau API calls
- Hanya mengubah tampilan (className, markup struktur)
- TETAP support dark/light mode (pakai CSS variables)
- Force light hanya di landing page & login
