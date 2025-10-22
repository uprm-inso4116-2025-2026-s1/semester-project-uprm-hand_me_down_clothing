export type Item = {
  id: number;
  name: string;
  category: string;
  color: string;
  brand: string;
  gender: string;
  size: string;
  price: number;
  condition: string;
}

const filterTypes: Record<string, string[]> = {
    'tops': ['SHIRT', 'JACKET', 'HOODIE', 'DRESS'],
    'bottoms': ['SOCKS', 'PANTS'],
    'dresses': ['DRESS'],
    'shoes': ['SANDAL','SNEAKER'],
    'outerwear': ['HOODIE', 'JACKET'],
    'accesories': ['WATCH', 'NECKLACE'],
    'kids': [],
}

export function filterByCategory(itemsList: Item[], category: string) {
    const result = itemsList.filter(item => filterTypes[category]?.includes(item.category));

    return result;
}

export function filterByGender(itemsList: Item[], gender: string) {
    const result = itemsList.filter(item => item.gender.toLowerCase() === gender);
    return result;
}

export function filterByAge(itemsList: Item[], ageGroup: string) {
    // for now return dummy data as there is no definition in the database of age groups

    // const result = itemsList.filter(item => item.ageGroup === ageGroup);
    return [];
}