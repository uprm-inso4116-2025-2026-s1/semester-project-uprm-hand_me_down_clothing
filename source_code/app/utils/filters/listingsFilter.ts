import { Piece } from "@/app/types/piece";
import { Category, Condition, Gender, Size } from "@/app/types/classifications";

// Grouping items into more general categories as for now the database does not classify items by this groups
const filterTypes: Record<string, string[]> = {
    'tops': ['SHIRT', 'JACKET', 'HOODIE', 'DRESS', 'COAT'],
    'bottoms': ['SOCKS', 'PANTS'],
    'dresses': ['DRESS'],
    'shoes': [],
    'outerwear': ['HOODIE', 'JACKET', 'COAT'],
    'underwear': [],
    'accesories': ['SCARF'],
    'size': ["SMALL_X2", "SMALL_X", "SMALL", "MEDIUM", "LARGE", "LARGE_X", "LARGE_X2", "CUSTOM",],
    'condition': ["NEW", "LIKE_NEW", "USED", "WORN", "OLD"]
}

export function filterByCategory(itemsList: Piece[], category: string) {
    const result = itemsList.filter(item => filterTypes[category]?.includes(Category[item.category]));

    return result;
}

export function filterByCondition(itemsList: Piece[], condition: string) {
    const result = itemsList.filter(item => Condition[item.condition].toLowerCase() === condition);
    return result;
}

export function filterBySize(itemsList: Piece[], size: string) {
    const result = itemsList.filter(item => Size[item.size].toLowerCase() === size);
    return result;
}

export function filterByGender(itemsList: Piece[], gender: string) {
    const result = itemsList.filter(item => Gender[item.gender].toLowerCase() === gender);
    return result;
}

export function filterByAccesories(itemsList: Piece[], accesories: string) {
    const result = itemsList.filter(item => filterTypes[accesories]?.includes(Category[item.category]));

    return result; 
}

export function filterByAge(itemsList: Piece[], ageGroup: string) {
    // for now return dummy data as there is no definition in the database of age groups

    // const result = itemsList.filter(item => item.ageGroup === ageGroup);
    return [];
}