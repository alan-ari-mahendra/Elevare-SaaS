export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    method: "GET",
    credentials: "include"
  });

  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
}
