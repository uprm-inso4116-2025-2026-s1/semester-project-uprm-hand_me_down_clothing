import { Piece } from './piece';
import { Category, Gender, Size, Condition, Status } from "./classifications";

export class SoldPiece extends Piece {
    constructor(
        id: number,
        name: string,
        category: Category,
        color: string,
        brand: string,
        gender: Gender,
        size: Size,
        price: number,
        condition: Condition,
        reason: string | null,
        images: Array<string>,
        user_id: string,
        status: Status,
    ) {
        super(id, name, category, color, brand, gender, size, price, condition, reason, images, user_id, status);
    }
}
