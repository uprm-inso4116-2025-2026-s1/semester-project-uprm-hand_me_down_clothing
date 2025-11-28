import { SoldPiece } from "@/app/types/sold_piece";
import { DonatedPiece } from "@/app/types/donated_piece";
import { Piece } from "@/app/types/piece";
import { Category, Condition, Gender, Size } from "@/app/types/classifications";

/**
 * Factory class responsible for creating Piece domain objects
 * (SoldPiece or DonatedPiece) and converting them to data transfer objects (DTOs).
 */
export class PieceFactory {
    /**
     * Creates a Piece domain object based on the provided database record.
     * Determines whether the record represents a SoldPiece or DonatedPiece
     * by checking the presence of a valid price.
     *
     * @param {Record<string, any>} item - Raw database record representing a piece.
     * @returns {Piece} - Returns either a SoldPiece or DonatedPiece instance.
     *
     * @example
     * const factory = new PieceFactory();
     * const piece = factory.makePiece({
     *   id: "1",
     *   name: "Blue Shirt",
     *   category: "SHIRT",
     *   price: 20,
     *   condition: "LIKE_NEW",
     *   images: [],
     *   user_id: "user123"
     * });
     * console.log(piece instanceof SoldPiece); // true
     */
    public makePiece(item: Record<string, any>) : Piece {
        const category = this.parseCategory(item['category']);
        const gender = this.parseGender(item['gender']);
        const size = this.parseSize(item['size']);
        const condition = this.parseCondition(item['condition']);
        if(item['price'] != null && item['price'] != 0){
            return new SoldPiece(
                item['id'],
                item['name'],
                category,
                item['color'],
                item['brand'],
                gender,
                size,
                item['price'],
                condition,
                item['reason'],
                item['images'],
                item['user_id'],
                status,
                item['latitude'],
                item['longitude'],
            );
        }
        else {
            return new DonatedPiece(
                item['id'],
                item['name'],
                category,
                item['color'],
                item['brand'],
                gender,
                size,
                condition,
                item['reason'],
                item['images'],
                item['user_id'],
                status,
                item['latitude'],
                item['longitude'],
                item['donation_center'] ?? null,
            );
        }
    }

    /**
     * Parses a given input into a Category enum value.
     * @param {string | number} category - The category input to parse.
     * @returns {Category} - The corresponding Category enum value.
     * @throws {Error} - Throws if the input is not a valid Category.
     */
    private parseCategory(category : string | number) : Category {
        if (typeof category === 'number') {
            if (Category[category] !== undefined) {
                return category as Category;
            }
        } else if (typeof category === 'string' && typeof category[0] != 'number') {
            const key = category.toUpperCase();
            if (Object.prototype.hasOwnProperty.call(Category, key)) {
                return Category[key as keyof typeof Category];
            }
        } else if (typeof category === 'string' && typeof category[0] == 'number') {
            const key = Number.parseInt(category);
            if (Category[key] !== undefined) {
                return key as Category;
            }
        }
        throw new Error(`Invalid Category value: ${category}`);
    }

    /**
     * Parses a given input into a Gender enum value.
     * @param {string | number} gender - The gender input to parse.
     * @returns {Gender} - The corresponding Gender enum value.
     * @throws {Error} - Throws if the input is not a valid Gender.
     */
    private parseGender(gender: string | number): Gender {
        if (typeof gender === 'number') {
            if (Gender[gender] !== undefined) {
                return gender as Gender;
            }
        } else if (typeof gender === 'string' && typeof gender[0] != 'number') {
            const key = gender.toUpperCase();
            if (Object.prototype.hasOwnProperty.call(Gender, key)) {
                return Gender[key as keyof typeof Gender];
            }
        } else if (typeof gender === 'string' && typeof gender[0] == 'number') {
            const key = Number.parseInt(gender);
            if (Gender[key] !== undefined) {
                return key as Gender;
            }
        }
        throw new Error(`Invalid Gender value: ${gender}`);
    }

    /**
     * Parses a given input into a Size enum value.
     * @param {string | number} size - The size input to parse.
     * @returns {Size} - The corresponding Size enum value.
     * @throws {Error} - Throws if the input is not a valid Size.
     */
    private parseSize(size: string | number): Size {
        if (typeof size === 'number') {
            if (Size[size] !== undefined) {
                return size as Size;
            }
        } else if (typeof size === 'string' && typeof size[0] != 'number') {
            const key = size.toUpperCase();
            if (Object.prototype.hasOwnProperty.call(Size, key)) {
                return Size[key as keyof typeof Size];
            }
        } else if (typeof size === 'string' && typeof size[0] == 'number') {
            const key = Number.parseInt(size);
            if (Size[key] !== undefined) {
                return key as Size;
            }
        }
        throw new Error(`Invalid Size value: ${size}`);
    }

    /**
     * Parses a given input into a Condition enum value.
     * @param {string | number} condition - The condition input to parse.
     * @returns {Condition} - The corresponding Condition enum value.
     * @throws {Error} - Throws if the input is not a valid Condition.
     */
    private parseCondition(condition: string | number): Condition {
        if (typeof condition === 'number') {
            if (Condition[condition] !== undefined) {
                return condition as Condition;
            }
        } else if (typeof condition === 'string' && typeof condition[0] != 'number') {
            const key = condition.toUpperCase();
            if (Object.prototype.hasOwnProperty.call(Condition, key)) {
                return Condition[key as keyof typeof Condition];
            }
        } else if (typeof condition === 'string' && typeof condition[0] == 'number') {
            const key = Number.parseInt(condition);
            if (Condition[key] !== undefined) {
                return key as Condition;
            }
        }
        throw new Error(`Invalid Condition value: ${condition}`);
    }

    /**
     * Converts a Piece domain object into a plain object suitable for
     * database insertion or update.
     *
     * @param {Piece} piece - The domain object to convert.
     * @returns {Record<string, any>} - Plain data object (DTO) representation of the piece.
     */
    public toDTO(piece: Piece): Record<string, any> {
        return {
            id: piece.id,
            name: piece.name,
            category: Category[piece.category],
            color: piece.color,
            brand: piece.brand,
            gender: Gender[piece.gender],
            size: Size[piece.size],
            price: piece.price,
            condition: Condition[piece.condition],
            reason: piece.reason,
            images: piece.images,
            user_id: piece.user_id,
        };
    }
}