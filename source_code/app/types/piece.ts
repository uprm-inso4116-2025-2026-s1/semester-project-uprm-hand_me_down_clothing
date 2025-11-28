import { Category, Gender, Size, Condition } from "./classifications";

export abstract class Piece {

    constructor(
        public id: number,
        public name: string,
        public category: Category,
        public color: string,
        public brand: string,
        public gender: Gender,
        public size: Size,
        public price: number | null,
        public condition: Condition,
        public reason: string | null,
        public images: Array<string>,
        public user_id: string,
    ) { }

    public getFormattedPrice(): string {
        if (this.price == null) { return `$0.00`; }
        return `$${this.price!.toFixed(2)}`;
    }

    // TODO: properly implement the following methods to aid UI team
    public getFormattedCategory(): string {
        return this.category.toString();
    }

    public getFormattedGender(): string {
        return this.gender.toString();
    }

    public getFormattedSize(): string {
        return this.size.toString();
    }

    public getFormattedCondition(): string {
        return this.condition.toString();
    }

    public toString(): string {
        return `Piece(id: ${this.id}, name: ${this.name}, category: ${this.category}, color: ${this.color}, brand: ${this.brand}, gender: ${this.gender}, size: ${this.size}, price: ${this.price}, condition: ${this.condition}, reason: ${this.reason}, images: ${this.images.toString()}, user_id: ${this.user_id})`;
    }

}