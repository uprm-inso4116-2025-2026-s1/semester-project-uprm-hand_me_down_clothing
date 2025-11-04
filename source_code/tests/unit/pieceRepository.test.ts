import { PieceRepository } from "@/src/repositories/pieceRepository";
import { Piece } from "@/app/types/piece";
import { Category, Condition, Gender, Size } from "@/app/types/classifications";
import { PieceFactory } from "@/src/factories/pieceFactory";
import { Lexend_Zetta } from "next/font/google";

describe("PieceRepository", () => {
    // TODO: add cases for all CRUD operations
  let factory: PieceFactory
  let repo: PieceRepository;

  beforeAll(() => {
    factory = new PieceFactory();
    repo = new PieceRepository();
  });

  test("should fetch pieces from the database", async () => {
    const pieces = await repo.getPieces();
    expect(Array.isArray(pieces)).toBe(true);
  });

  test("should return null for non-existent piece ID", async () => {
    const piece = await repo.getPieceById(0);
    expect(piece).toBeNull();
  });

  test("should create a new piece and link to a user", async () => {
    const user_id = "00000000-0000-0000-0000-000000000000";

    const piece: Piece = factory.makePiece({
      id: 0,
      name: "Test Jacket",
      category: Category.JACKET,
      color: "Black",
      brand: "TestBrand",
      gender: Gender.UNISEX,
      size: Size.MEDIUM,
      price: 40,
      condition: Condition.USED,
      reason: "Test reason",
      images: [],
      user_id,
    });

    const result : Piece | Error = await repo.createPiece(piece);
    expect(result).toBeInstanceOf(Piece);

    // verify it exists in Supabase now
    const fetched = await repo.getPieceById((result as Piece).id);
    expect(fetched).not.toBeNull();
    expect(fetched!.id).not.toBe(piece.id);
    expect(fetched!.name).toBe(piece.name);
    expect(fetched!.category).toBe(piece.category);
    expect(fetched!.color).toBe(piece.color);
    expect(fetched!.brand).toBe(piece.brand);
    expect(fetched!.gender).toBe(piece.gender);
    expect(fetched!.size).toBe(piece.size);
    expect(fetched!.price).toBe(piece.price);
    expect(fetched!.condition).toBe(piece.condition);
    expect(fetched!.reason).toBe(piece.reason);
    expect(fetched!.images).toEqual(piece.images);
    expect(fetched!.user_id).toBe(user_id);

    // cleanup
    const deleted : boolean = await repo.deletePiece(fetched!.id);

    expect(deleted).toBe(true);
  });

  test("should delete a piece successfully", async () => {
    const user_id = "00000000-0000-0000-0000-000000000000";

    const piece: Piece | Error = factory.makePiece({
      id: 0,
      name: "Delete Me",
      category: Category.SHIRT,
      color: "Red",
      brand: "BrandA",
      gender: Gender.MALE,
      size: Size.LARGE,
      price: 10,
      condition: Condition.USED,
      reason: "Cleaning test data",
      images: [],
      user_id,
    });

    const result : Piece | Error = await repo.createPiece(piece);
    expect(result as Piece).toBeInstanceOf(Piece);

    const deleted = await repo.deletePiece((result as Piece).id);
    expect(deleted).toBe(true);
  });

  test("should fail to create a new piece", async () => {
    const user_id = "invalid-user-id";

    const piece: Piece = factory.makePiece({
      id: 0,
      name: "Test Jacket",
      category: Category.JACKET,
      color: "Black",
      brand: "TestBrand",
      gender: Gender.UNISEX,
      size: Size.MEDIUM,
      price: 40,
      condition: Condition.USED,
      reason: "Test reason",
      images: [],
      user_id,
    });

    const result = await repo.createPiece(piece);
    expect(result.name).toBeUndefined();
  });

  test("should fail to delete non-existing piece", async () => {
    const deleted = await repo.deletePiece(0);
    expect(deleted).toBe(false);
  });
});