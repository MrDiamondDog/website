export type CollectionCat = {
    count: number;
} & APICat;

export interface APICat {
    id: string;
    tags: string[];
    created_at: string;
    url: string;
    mimeType: string;
}

export function getCatCollection(): CollectionCat[] {
    if (!window.localStorage.getItem("cat-collection"))
        window.localStorage.setItem("cat-collection", btoa("[]"));

    return JSON.parse(atob(window.localStorage.getItem("cat-collection"))) || [];
}

export async function getTotalCats() {
    return await fetch("https://cataas.com/api/count").then(res => res.json())
        .then(data => data.count)
        .catch(() => 0);
}

export function getCollectedCatsCount() {
    return getCatCollection().length;
}

export function addCatToCollection(cat: APICat) {
    const collection = getCatCollection();
    const existingCat = collection.find(c => c.id === cat.id);

    delete cat.tags;

    if (existingCat) {
        existingCat.count++;
    } else {
        collection.push({ ...cat, count: 1 });
    }

    window.localStorage.setItem("cat-collection", btoa(JSON.stringify(collection)));
}

export async function cacheAllCats() {
    const totalCats = await getTotalCats();

    if (totalCats === window.localStorage.getItem("total-cats"))
        return;

    window.localStorage.setItem("total-cats", totalCats.toString());

    const cats = await fetch(`https://cataas.com/api/cats?limit=${totalCats}`).then(res => res.json());

    cats.map(cat => delete cat.tags);

    window.localStorage.setItem("all-cats", btoa(JSON.stringify(cats)));
}
