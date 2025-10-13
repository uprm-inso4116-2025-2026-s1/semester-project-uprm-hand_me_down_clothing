// TODO: add subclasses for sold pieces and donated pieces

export class Piece {

    constructor(
        public id: string,
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

    getFormattedPrice() {
        if (this.price == null) { return `$0.00`; }
        return `$${this.price!.toFixed(2)}`;
    }

}

enum Condition {
    NEW,
    LIKE_NEW,
    USED,
    WORN,
    OLD,
}

enum Category {
    SHIRT,
    DRESS,
    JACKET,
    PANTS,
    UNDERWEAR,
    SOCKS,
    SCARF,
    HOODIE,
    COAT,
}

enum Gender {
    FEMALE,
    MALE,
    UNISEX
}

enum Size {
    SMALL_X2,
    SMALL_X,
    SMALL,
    MEDIUM,
    LARGE,
    LARGE_X,
    LARGE_X2,
    CUSTOM
}
