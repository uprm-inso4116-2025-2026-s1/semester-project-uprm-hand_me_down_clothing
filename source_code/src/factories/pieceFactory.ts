import { SoldPiece } from "@/app/types/sold_piece";
import { DonatedPiece } from "@/app/types/donated_piece";
import { Piece } from "@/app/types/piece";

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
    public makePiece(item: Record<string, any> ): Piece {
        if(item['price'] != null && item['price'] != 0){
            return new SoldPiece(
                item['id'],
                item['name'],
                item['category'],
                item['color'],
                item['brand'],
                item['gender'],
                item['size'],
                item['price'],
                item['condition'],
                item['reason'],
                item['images'],
                item['user_id'],
            );
        }
        else {
            return new DonatedPiece(
                item['id'],
                item['name'],
                item['category'],
                item['color'],
                item['brand'],
                item['gender'],
                item['size'],
                item['condition'],
                item['reason'],
                item['images'],
                item['user_id'],
                item['donation_center'] ?? null,
            );
        }
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
            category: piece.category,
            color: piece.color,
            brand: piece.brand,
            gender: piece.gender,
            size: piece.size,
            price: piece.price,
            condition: piece.condition,
            reason: piece.reason,
            images: piece.images,
            user_id: piece.user_id,
        };
    }
}