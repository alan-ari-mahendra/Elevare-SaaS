# Tasks Section — Visual Improvement Plan

## Scope
Semua halaman di `src/app/(main)/tasks/` — list dan detail.
Fokus tampilan, tidak mengubah fungsional/logic.

## Aturan
- Dark/light mode DIPERTAHANKAN (pakai CSS variables)
- Tidak mengubah routing, API calls, drag-and-drop logic, atau data flow
- Hanya mengubah className dan markup struktur

---

## 1. Task List Page (`tasks/page.tsx`)

### 1a. Stats Cards — Konsisten dengan Dashboard
**Masalah:** 4 stat cards pakai style lama (icon kecil di kanan, plain card).

**Solusi:** Samakan style dengan dashboard — icon background berwarna per stat:
- Total Tasks → `bg-primary/10` icon `text-primary`
- To Do → `bg-slate-500/10` icon `text-slate-500`
- In Progress → `bg-amber-500/10` icon `text-amber-500`
- Completed → `bg-emerald-500/10` icon `text-emerald-500`

### 1b. Filter Bar — Compact Inline
**Masalah:** Filters dalam Card wrapper, banyak kontrol berjejer, berat secara visual.

**Solusi:**
- Hapus Card wrapper
- Search full width di baris pertama
- Filter dropdowns + sort + reorder toggle di baris kedua, inline
- Lebih compact, `h-9` semua

### 1c. Task Cards — Polish
**Masalah:** Card sudah oke tapi bisa lebih refined.

**Solusi:**
- Hover effect lebih smooth (border + shadow)
- Badges lebih kecil (`text-[10px]`)
- Timestamp lebih subtle
- Actions (dropdown) tersembunyi, muncul saat hover

---

## 2. Task Detail Page (`tasks/[id]/page.tsx`)

### 2a. Header — Lebih Clean
**Masalah:** Breadcrumb + title + buttons berjejer, bisa lebih rapi.

**Solusi:**
- Breadcrumb separator lebih subtle
- Title + status + priority badge dalam satu baris
- Action buttons (Edit, Delete) lebih compact, `size="sm"`

### 2b. Detail Grid — Lebih Polished
**Masalah:** Left column detail grid (status, priority, due date, project, assignee) bisa lebih visual.

**Solusi:**
- Detail items pakai icon background berwarna (mirip stats cards)
- Layout lebih structured dengan separator

### 2c. Right Sidebar Cards — Konsisten
**Masalah:** Project card dan Timeline card plain.

**Solusi:**
- Samakan border + padding style
- Timeline items pakai mini timeline (dot + line) mirip dashboard recent activity

### 2d. Comment Section — Lebih Clean
**Masalah:** Comment section sudah fungsional tapi bisa di-polish.

**Solusi:**
- Comment bubble style yang lebih ringan
- Timestamp inline dengan nama user
- Delete button hanya muncul saat hover

---

## Urutan Pengerjaan

```
1. Stats cards (konsisten)
2. Filter bar (compact)
3. Task cards (polish)
4. Detail header (clean)
5. Detail grid + sidebar (polish)
6. Comment section (polish)
```

## Prioritas

**High impact:**
- 1a (stats), 1b (filter bar), 2a (header)

**Medium impact:**
- 1c (task cards), 2b (detail grid), 2c (sidebar)

**Low priority:**
- 2d (comment section)
