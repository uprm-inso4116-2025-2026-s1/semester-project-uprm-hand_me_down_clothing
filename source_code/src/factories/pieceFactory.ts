import { SoldPiece } from "@/app/types/sold_piece";
import { DonatedPiece } from "@/app/types/donated_piece";
import { Piece } from "@/app/types/piece";
import { Category, Condition, Gender, Size, Status } from "@/app/types/classifications";

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
        const status = this.parseStatus(item['status']);
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
     * Generic enum parser used by specific enum parsers below.
     */
    private parseEnum<T>(enumType: any, value: string | number, label: string): T {
        if (typeof value === 'number') {
            if (enumType[value] !== undefined) {
                return value as T;
            }
        } else if (typeof value === 'string') {
            // direct key match (case-insensitive)
            const key = value.toUpperCase();
            if (Object.prototype.hasOwnProperty.call(enumType, key)) {
                return enumType[key as keyof typeof enumType] as T;
            }

            // numeric string like "1"
            const numeric = Number.parseInt(value as string);
            if (!isNaN(numeric) && enumType[numeric] !== undefined) {
                return numeric as T;
            }
        }
        throw new Error(`Invalid ${label} value: ${value}`);
    }

    private parseCategory(category : string | number) : Category {
        return this.parseEnum<Category>(Category, category, 'Category');
    }

    private parseGender(gender: string | number): Gender {
        return this.parseEnum<Gender>(Gender, gender, 'Gender');
    }

    private parseSize(size: string | number): Size {
        return this.parseEnum<Size>(Size, size, 'Size');
    }

    private parseCondition(condition: string | number): Condition {
        return this.parseEnum<Condition>(Condition, condition, 'Condition');
    }

    private parseStatus(status: string | number): Status {
        return this.parseEnum<Status>(Status, status, 'Status');
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
            status: Status[piece.status],
        };
    }
}