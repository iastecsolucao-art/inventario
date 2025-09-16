const API_BASE = process.env.NEXT_PUBLIC_API_BASE; // precisa ser NEXT_PUBLIC para ser visível no front-end

export async function uploadFile(file, tipo) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("tipo", tipo);   // <-- garantir que vai junto!

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Erro no upload: " + res.statusText);
  }
  return await res.json();
}