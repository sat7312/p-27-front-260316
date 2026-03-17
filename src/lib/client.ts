export function fetchApi(url: string, options?: RequestInit) {
    if (options?.body) {
      const headers = new Headers(options.headers || {});
      headers.set("Content-Type", "application/json");
      options.headers = headers;
    }
    
    return fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`, options).then(
        (res) => res.json()
    );
}