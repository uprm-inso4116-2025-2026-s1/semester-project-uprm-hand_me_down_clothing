import { Category, Gender, Size } from "@/app/types/classifications";
import { Piece } from "@/app/types/piece";

export abstract class PieceSpecification {
  abstract isSatisfiedBy(piece: Piece): boolean;
}

export class CategorySpec extends PieceSpecification {
  constructor(private category: Category) { super(); }
  isSatisfiedBy(p: Piece) { return p.category === this.category; }
}

export class GenderSpec extends PieceSpecification {
  constructor(private gender: Gender) { super(); }
  isSatisfiedBy(p: Piece) { return p.gender === this.gender; }
}

export class SizeSpec extends PieceSpecification {
  constructor(private size: Size) { super(); }
  isSatisfiedBy(p: Piece) { return p.size === this.size; }
}

export class AndSpec extends PieceSpecification {
  constructor(private specs: PieceSpecification[]) { super(); }

  isSatisfiedBy(piece: Piece) {
    return this.specs.every(s => s.isSatisfiedBy(piece));
  }
}