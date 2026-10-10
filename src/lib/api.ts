const BASE_URL_1 = "https://api.api-store.workers.dev/api/bazardor";
const BASE_URL_2 = "https://api.abcz.workers.dev/api/bazardor";

async function fetchWithFallback(endpoint: string) {
  try {
    const res = await fetch(`${BASE_URL_1}${endpoint}`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Primary API failed");
    return await res.json();
  } catch (error) {
    try {
      const res = await fetch(`${BASE_URL_2}${endpoint}`, { cache: 'no-store' });
      if (!res.ok) throw new Error("Alternative API failed");
      return await res.json();
    } catch (err) {
      console.error("API fetch error:", err);
      return [];
    }
  }
}

export async function getAllProducts() {
  return await fetchWithFallback("/products");
}

export async function getProductsByCategory(categorySlug: string) {
  return await fetchWithFallback(`/products?category=${categorySlug}`);
}

export async function getSingleProduct(slug: string) {
  return await fetchWithFallback(`/products/${slug}`);
}

export async function getCategories() {
  return await fetchWithFallback("/categories");
}