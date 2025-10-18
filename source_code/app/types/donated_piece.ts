import { Piece } from './piece';
import { Category, Gender, Size, Condition } from "./classifications";

export class DonatedPiece extends Piece {
    constructor(
        id: string,
        name: string,
        category: Category,
        color: string,
        brand: string,
        gender: Gender,
        size: Size,
        condition: Condition,
        reason: string | null,
        images: Array<string>,
        user_id: string,
        public donation_center: string | null = null, // TODO: consider adding this to the Supabase schema
    ) {
        super(id, name, category, color, brand, gender, size, null, condition, reason, images, user_id);
    }
}
