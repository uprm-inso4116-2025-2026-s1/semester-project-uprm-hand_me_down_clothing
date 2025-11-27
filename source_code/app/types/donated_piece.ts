import { Piece } from './piece';
import { Category, Gender, Size, Condition, Status } from "./classifications";

export class DonatedPiece extends Piece {
    constructor(
        id: number,
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
        latitude: number | null,
        longitude: number | null,
        status: Status,
        donation_center: string | null = null,
    ) {
        super(id, name, category, color, brand, gender, size, null, condition, reason, images, user_id, latitude, longitude, status, donation_center);
    }
}
