async function makeRequest<T>(path: string, config: RequestInit): Promise<T> {
  const request = new Request(path, config);
  const response = await fetch(request);

  if (!response.ok) {
    throw new Error("Failed to complete request");
  }
  return response.json().catch(() => ({}));
}

export async function httpGet<T>(
  path: string,
  config?: RequestInit
): Promise<T> {
  const headers = { "Content-Type": "application/json" };
  const init = { method: "GET", headers, ...config };
  return await makeRequest<T>(path, init);
}

export async function httpPost<T, U>(
  path: string,
  body: T,
  config?: RequestInit
): Promise<U> {
  const headers = { "Content-Type": "application/json" };
  const init = {
    method: "POST",
    body: JSON.stringify(body),
    headers,
    ...config,
  };
  return await makeRequest<U>(path, init);
}

export async function httpPatch<T, U>(
  path: string,
  body: T,
  config?: RequestInit
): Promise<U> {
  const headers = { "Content-Type": "application/json" };
  const init = {
    method: "PATCH",
    body: JSON.stringify(body),
    headers,
    ...config,
  };
  return await makeRequest<U>(path, init);
}

export async function httpDelete<T>(
  path: string,
  config?: RequestInit
): Promise<T> {
  const init = { method: "DELETE", ...config };
  return await makeRequest<T>(path, init);
}
