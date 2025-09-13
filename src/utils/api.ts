export async function fetchGenAI(prompt: string) {
  const res = await fetch("https://sena-backend-username.codesandbox.io/api/genai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });

  const data = await res.json();
  return data.response;
}
