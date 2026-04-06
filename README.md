# CloudBox

CloudBox is a file management web application built with React, TypeScript, and Supabase.
It supports authentication, folders, file upload, sharing, public links, and trash recovery.

## Tech Stack

- React + TypeScript + Vite
- Supabase (Auth, Postgres, Storage)
- Tailwind CSS
- React Router

## Requirements

- Node.js 18+
- Bun 1.0+
- A Supabase project

## Environment Setup

Copy the environment template and provide your Supabase values.

1. Create `.env.local` in the project root.
2. Copy values from `.env.example`.
3. Fill these variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

You can find both in Supabase Dashboard:
Project Settings -> API.

## Supabase Setup (Important)

Create a Storage bucket named `files`.

This project uploads files using:

- storage bucket: `files`
- path format: `<user_id>/<generated_filename>`

If the bucket is missing, file previews/public URLs will fail with:
`Bucket not found`.

## How to Start

Install dependencies:

`bun install`

Run development server:

`bun run dev`

Build for production:

`bun run build`

Preview production build locally:

`bun run preview`

## Application Routes

- `/login` - Login
- `/signup` - Signup
- `/dashboard` - Overview (recent files + stats)
- `/dashboard/files` - My Files (folders + all files)
- `/dashboard/shared` - Shared with me
- `/dashboard/public` - Public files
- `/dashboard/trash` - Trash
- `/dashboard/folder/:folderId` - Folder contents
