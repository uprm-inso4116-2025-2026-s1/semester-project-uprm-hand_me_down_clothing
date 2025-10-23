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
    'tops': ['SHIRT', 'JACKET', 'HOODIE', 'DRESS', 'COAT'],
    'bottoms': ['SOCKS', 'PANTS'],
    'dresses': ['DRESS'],
    'shoes': ['SANDAL','SNEAKER'],
    'outerwear': ['HOODIE', 'JACKET', 'COAT'],
    'underwear': [],
    'accesories': ['WATCH', 'NECKLACE', 'SCARF'],
    'size': ["SMALL_X2", "SMALL_X", "SMALL", "MEDIUM", "LARGE", "LARGE_X", "LARGE_X2", "CUSTOM",],
    'condition': ["NEW", "LIKE_NEW", "USED", "WORN", "OLD"]
}

export function filterByCategory(itemsList: Item[], category: string) {
    const result = itemsList.filter(item => filterTypes[category]?.includes(item.category));

    return result;
}

export function filterByCondition(itemsList: Item[], condition: string) {
    const result = itemsList.filter(item => item.condition.toLowerCase() === condition);
    return result;
}

export function filterBySize(itemsList: Item[], size: string) {
    const result = itemsList.filter(item => item.size.toLowerCase() === size);
    return result;
}

export function filterByGender(itemsList: Item[], gender: string) {
    const result = itemsList.filter(item => item.gender.toLowerCase() === gender);
    return result;
}

export function filterByAccesories(itemsList: Item[], accesories: string) {
    const result = itemsList.filter(item => filterTypes[accesories]?.includes(item.category));

    return result; 
}

export function filterByAge(itemsList: Item[], ageGroup: string) {
    // for now return dummy data as there is no definition in the database of age groups

    // const result = itemsList.filter(item => item.ageGroup === ageGroup);
    return [];
}