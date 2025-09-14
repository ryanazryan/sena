export async function fetchGenAI(prompt: string) {
  const res = await fetch("https://tvp6l8-2222.csb.app/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });

  const data = await res.json();
  return data.response;
}
