# Projects Section — Visual Improvement Plan

## Scope
Semua halaman di `src/app/(main)/projects/` — list, detail, new, edit.
Fokus tampilan, tidak mengubah fungsional/logic.

## Aturan
- Dark/light mode DIPERTAHANKAN (pakai CSS variables)
- Tidak mengubah routing, API calls, atau data flow
- Hanya mengubah className dan markup struktur

---

## 1. Projects List Page (`projects/page.tsx`)

### 1a. Filter Bar — Lebih Compact
**Masalah:** Filter bar dalam Card terpisah, terasa berat. 3 input sejajar kurang rapi di mobile.

**Solusi:**
- Hapus Card wrapper, jadikan inline toolbar langsung di bawah heading
- Search, status filter, dan sort dalam satu baris horizontal
- Di mobile, search full width, filter dan sort di baris kedua

**File:** `src/components/projects/projects-filters.tsx`

### 1b. Project Cards — Polish
**Masalah:** Cards sudah oke tapi bisa lebih polished.

**Solusi:**
- Progress bar color-coded (emerald >80%, amber <30%, primary default)
- Hover shadow lebih smooth (`hover:shadow-md transition-all`)
- Status icon di kiri atas card, badge di kanan atas
- Meta info (dates, tasks count) lebih compact

**File:** `src/components/projects/project-card.tsx`

### 1c. Empty State — Lebih Engaging
**Masalah:** Empty state generic.

**Solusi:**
- Ilustrasi JSX sederhana (folder kosong atau kanban board kosong)
- Teks lebih empatis: "No projects yet. Start by creating your first one."
- CTA button lebih prominent

**File:** `src/app/(main)/projects/page.tsx`

---

## 2. Project Detail Page (`projects/[id]/page.tsx`)

### 2a. Header Section — Lebih Clean
**Masalah:** Banyak info berjejer (breadcrumb, title, meta, buttons) terasa cluttered.

**Solusi:**
- Breadcrumb tetap
- Title + status badge dalam satu baris
- Meta info (dates) dalam satu baris kecil di bawah title
- Action buttons (Edit, Generate Tasks, More) di kanan, lebih compact

### 2b. Stats Cards — Konsisten dengan Dashboard
**Masalah:** 4 stat cards di project detail pakai style berbeda dari dashboard.

**Solusi:**
- Samakan style dengan dashboard stats (icon background berwarna per card)
- Atau gunakan inline stats tanpa card (lebih compact, karena ini sub-page)

### 2c. Task List Items — Lebih Scannable
**Masalah:** Task items punya banyak elemen (checkbox, title, badges, dates, actions) yang bisa overwhelming.

**Solusi:**
- Layout lebih structured: checkbox | title+description | priority | status | date | actions
- Hover row highlight
- Actions tersembunyi, muncul saat hover

**File:** `src/components/projects/task-item.tsx`

### 2d. Kanban Board — Styling Polish
**Masalah:** Kanban cards sudah fungsional tapi styling bisa di-improve.

**Solusi:**
- Column header pakai warna accent (subtle background)
- Card hover effect
- Priority dot/indicator lebih subtle

**File:** `src/components/projects/kanban.tsx`

---

## 3. New/Edit Project Form (`project-form.tsx`)

### 3a. Form Layout — Lebih Modern
**Masalah:** Form fields dalam Card, standard layout.

**Solusi:**
- Section grouping: "Basic Info" (name, description) dan "Settings" (status, color, dates)
- Separator visual antara sections
- Color picker lebih visual (colored circles yang bisa diklik, bukan dropdown)
- Date pickers side by side lebih rapi

**File:** `src/components/projects/project-form.tsx`

---

## 4. Task Modal (`task-modal.tsx`)

### 4a. Modal Styling
**Masalah:** Standard dialog, bisa lebih polished.

**Solusi:**
- Field grouping: Basic (title, description), Settings (status, priority, project), Schedule (due date)
- AI suggest button lebih integrated (bukan terpisah)
- Priority select pakai colored indicators

**File:** `src/components/projects/task-modal.tsx`

---

## Urutan Pengerjaan

```
1. Filter bar (compact)
2. Project cards (polish)  
3. Project detail header (clean up)
4. Project detail stats (konsisten)
5. Task list items (scannable)
6. Form layout (modern)
7. Kanban polish
8. Task modal
```

## Prioritas

**High impact, low effort:**
- 1a (filter bar), 1b (project cards), 2a (header clean)

**Medium impact:**
- 2b (stats), 2c (task items), 3a (form)

**Low priority / nice to have:**
- 2d (kanban), 4a (task modal)
