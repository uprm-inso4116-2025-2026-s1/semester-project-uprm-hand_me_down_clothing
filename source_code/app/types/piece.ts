import { Category, Gender, Size, Condition, Status } from "./classifications";

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
        public status: Status,
    ) { }

    public getFormattedPrice(): string {
        if (this.price == null) { return `$0.00`; }
        return `$${this.price!.toFixed(2)}`;
    }

    private pretty(s: string | undefined | null): string {
        if (!s) return '';
        // replace underscores and hyphens, make Title Case
        return s
            .replace(/[_-]/g, ' ')
            .toLowerCase()
            .split(' ')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
    }

    public getFormattedCategory(): string {
        // Category enum keys are expected to be available via the enum name lookup
        try {
            const raw = (Category as any)[this.category];
            return this.pretty(raw);
        } catch {
            return String(this.category);
        }
    }

    public getFormattedGender(): string {
        try {
            const raw = (Gender as any)[this.gender];
            return this.pretty(raw);
        } catch {
            return String(this.gender);
        }
    }

    public getFormattedSize(): string {
        try {
            const raw = (Size as any)[this.size];
            return this.pretty(raw);
        } catch {
            return String(this.size);
        }
    }

    public getFormattedCondition(): string {
        try {
            const raw = (Condition as any)[this.condition];
            return this.pretty(raw);
        } catch {
            return String(this.condition);
        }
    }

    public toString(): string {
        return `Piece(id: ${this.id}, name: ${this.name}, category: ${this.category}, color: ${this.color}, brand: ${this.brand}, gender: ${this.gender}, size: ${this.size}, price: ${this.price}, condition: ${this.condition}, reason: ${this.reason}, images: ${this.images.toString()}, user_id: ${this.user_id}, status: ${this.status})`;
    }

}