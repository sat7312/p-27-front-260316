export function fetchApi(url: string) {
    return fetch(url)
        .then(response => response.json());
}