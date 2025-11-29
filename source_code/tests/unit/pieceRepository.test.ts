import { PieceRepository } from "@/src/repositories/pieceRepository";
import { Piece } from "@/app/types/piece";
import { Category, Condition, Gender, Size } from "@/app/types/classifications";
import { PieceFactory } from "@/src/factories/pieceFactory";

describe("PieceRepository", () => {

    let factory: PieceFactory
    let repo: PieceRepository;

    beforeAll(() => {
        factory = new PieceFactory();
        repo = new PieceRepository();
    });

    test("should create and retrieve a piece", async () => {
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
            status: 0,
            reason: "Test reason",
            images: [],
            user_id,
        });

        const created = await repo.createPiece(piece) as Piece;
        expect(created).toBeInstanceOf(Piece);
        expect(created.name).toBe(piece.name);

        const fetched = await repo.getPieceById(created.id);
        expect(fetched).not.toBeNull();
        expect(fetched!.name).toBe(piece.name);
        expect(fetched!.user_id).toBe(user_id);

        // cleanup
        await repo.deletePiece(fetched!.id);
    });

    test("should update an existing piece", async () => {
        const user_id = "00000000-0000-0000-0000-000000000000";

        const piece = factory.makePiece({
            id: 0,
            name: "Original Name",
            category: Category.JACKET,
            color: "Blue",
            brand: "Brand",
            gender: Gender.UNISEX,
            size: Size.SMALL,
            price: 25,
            condition: Condition.NEW,
            status: 0,
            reason: "Test",
            images: [],
            user_id,
        });

        const created = await repo.createPiece(piece) as Piece;
        (created as any).name = "Updated Name";

        const updated = await repo.updatePiece(created);
        expect(updated).toBeInstanceOf(Piece);
        expect(updated!.name).toBe("Updated Name");

        // cleanup
        await repo.deletePiece(created.id);
    });

    test("should delete a piece", async () => {
        const user_id = "00000000-0000-0000-0000-000000000000";

        const piece = factory.makePiece({
            id: 0,
            name: "To Delete",
            category: Category.SHIRT,
            color: "Red",
            brand: "Brand",
            gender: Gender.MALE,
            size: Size.LARGE,
            price: 10,
            condition: Condition.USED,
            status: 0,
            reason: "Test",
            images: [],
            user_id,
        });

        const created = await repo.createPiece(piece) as Piece;
        const deleted = await repo.deletePiece(created.id);
        expect(deleted).toBe(true);
    });
});

describe("Piece class display methods", () => {
    let factory: PieceFactory;

    beforeAll(() => {
        factory = new PieceFactory();
    });

    test("should format piece title and description", () => {
        const piece = factory.makePiece({
            id: 1,
            name: "Blue T-Shirt",
            category: Category.SHIRT,
            color: "Blue",
            brand: "Nike",
            gender: Gender.UNISEX,
            size: Size.MEDIUM,
            price: 25,
            condition: Condition.LIKE_NEW,
            status: 0,
            reason: "Too small for me",
            images: [],
            user_id: "user123",
        });

        expect(piece.getTitle()).toBe("Blue T-Shirt");
        expect(piece.getDescription()).toBe("Too small for me");
    });

    test("should format price correctly", () => {
        const piece = factory.makePiece({
            id: 1,
            name: "Item",
            category: Category.SHIRT,
            color: "Red",
            brand: "Brand",
            gender: Gender.MALE,
            size: Size.LARGE,
            price: 19.99,
            condition: Condition.USED,
            status: 0,
            reason: null,
            images: [],
            user_id: "user123",
        });

        expect(piece.getFormattedPrice()).toBe("$19.99");
    });

    test("should return category trail and tags", () => {
        const piece = factory.makePiece({
            id: 1,
            name: "Jacket",
            category: Category.JACKET,
            color: "Black",
            brand: "Adidas",
            gender: Gender.FEMALE,
            size: Size.SMALL,
            price: 50,
            condition: Condition.NEW,
            status: 0,
            reason: "New without tags",
            images: [],
            user_id: "user123",
        });

        expect(piece.getCategoryTrail()).toEqual(["Home", "Jacket"]);
        expect(piece.getTags()).toEqual(["Female"]);
    });

    test("should format badges with condition and size", () => {
        const piece = factory.makePiece({
            id: 1,
            name: "Pants",
            category: Category.PANTS,
            color: "Gray",
            brand: "Levi",
            gender: Gender.MALE,
            size: Size.MEDIUM,
            price: 40,
            condition: Condition.WORN,
            status: 0,
            reason: "Replaced with new pair",
            images: [],
            user_id: "user123",
        });

        const badges = piece.getBadges();
        expect(badges.length).toBe(2);
        expect(badges[0]).toBe("Worn");
        expect(badges[1]).toBe("Medium");
    });

    test("should format location from coordinates", () => {
        const piece = factory.makePiece({
            id: 1,
            name: "Dress",
            category: Category.DRESS,
            color: "Pink",
            brand: "H&M",
            gender: Gender.FEMALE,
            size: Size.SMALL_X,
            price: 30,
            condition: Condition.LIKE_NEW,
            status: 0,
            reason: "Never worn",
            images: [],
            user_id: "user123",
            latitude: 18.2012,
            longitude: -67.1414,
        });

        const location = piece.getLocation();
        expect(location).toContain("18.2012");
        expect(location).toContain("-67.1414");
    });

    test("should return N/A for missing location", () => {
        const piece = factory.makePiece({
            id: 1,
            name: "Hat",
            category: Category.SCARF,
            color: "White",
            brand: "Generic",
            gender: Gender.UNISEX,
            size: Size.CUSTOM,
            price: 10,
            condition: Condition.USED,
            status: 0,
            reason: "No longer needed",
            images: [],
            user_id: "user123",
            latitude: null,
            longitude: null,
        });

        expect(piece.getLocation()).toBe("N/A");
    });

    test("should extract donor initials from user_id", () => {
        const piece = factory.makePiece({
            id: 1,
            name: "Socks",
            category: Category.SOCKS,
            color: "Black",
            brand: "Nike",
            gender: Gender.UNISEX,
            size: Size.MEDIUM,
            price: 5,
            condition: Condition.NEW,
            status: 0,
            reason: "Extra pair",
            images: [],
            user_id: "john-doe@example.com",
        });

        expect(piece.getDonorInitials()).toBe("J");
    });

    test("should return U for missing user_id", () => {
        const piece = factory.makePiece({
            id: 1,
            name: "Hoodie",
            category: Category.HOODIE,
            color: "Gray",
            brand: "Champion",
            gender: Gender.UNISEX,
            size: Size.LARGE,
            price: 35,
            condition: Condition.LIKE_NEW,
            status: 0,
            reason: "Duplicate",
            images: [],
            user_id: "",
        });

        expect(piece.getDonorInitials()).toBe("U");
    });
});