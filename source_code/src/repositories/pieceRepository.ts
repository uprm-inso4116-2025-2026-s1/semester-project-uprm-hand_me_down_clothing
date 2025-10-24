import { Piece } from "@/app/types/piece";
import { createClient } from '@/app/utils/supabase/client'
import { PieceFactory } from "../factories/pieceFactory";

/**
 * Repository class responsible for all CRUD operations and data retrieval
 * for Piece domain objects from the Supabase database.
 *
 * Responsibilities:
 * - Fetch all pieces or a single piece by ID.
 * - Create, update, and delete piece records with optional soft-fail handling.
 * - Filter pieces based on multiple criteria such as name, category, brand, size, color, gender, price, and condition.
 *
 * This repository uses the PieceFactory to:
 * - Convert raw database records into domain objects (SoldPiece or DonatedPiece).
 * - Transform domain objects into DTOs suitable for database operations.
 *
 * All methods interacting with the database handle errors gracefully
 * and return either domain objects, arrays of objects, or booleans indicating operation success.
 */
export class PieceRepository {
    private factory = new PieceFactory();
    private supabase = createClient();

    /**
     * Retrieves all pieces from the Supabase 'pieces' table.
     * @returns {Promise<Array<Piece>>} - An array of Piece objects.
     */
    public async getPieces(): Promise<Array<Piece>> {
        try {
            const pieces_data = (await this.supabase.from('pieces').select("*")).data;
            if (!pieces_data) return [];
            const pieces = pieces_data.map((item) => this.factory.makePiece(item));
            return pieces;
        } catch {
            return [];
        }
    }

    private validatePieceData(piece: Piece) {
        if (!piece.id || !piece.name || !piece.category || !piece.user_id) {
            throw new Error("Missing required fields: id, name, category, or user_id.");
        }
    }


    /**
     * Retrieves a piece by its ID from the database.
     * @param {string} id - The ID of the piece to retrieve.
     * @returns {Promise<Piece | null>} - The Piece object if found, otherwise null.
     */
    public async getPieceById(id: string): Promise<Piece | null> {
        try {
            const { data, error } = await this.supabase.from('pieces').select("*").eq('id', id).single();
            if (error || !data) return null;
            return this.factory.makePiece(data);
        } catch {
            return null;
        }
    }

    /**
     * Inserts a new piece record into the database.
     * Returns `true` if successful, otherwise `false`.
     * @param {Piece} piece - The piece object to create.
     * @returns {Promise<boolean>}
     */
    public async createPiece(piece: Piece): Promise<Error | null> {
        try {
            this.validatePieceData(piece);
        } catch {
            return Error("Invalid data for piece: " + piece.toString());
        }
        const { error } = await this.supabase.from('pieces').insert([{
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
            user_id: piece.user_id
        }]);
        return error;
    }

    /**
     * Updates an existing piece record.
     * Returns `true` if successful, otherwise `false`.
     * @param {Piece} piece - The piece object to update.
     * @returns {Promise<boolean>}
     */
    public async updatePiece(piece: Piece): Promise<boolean> {
        try {
            this.validatePieceData(piece);
            const dto = this.factory.toDTO(piece);
            const { error } = await this.supabase.from('pieces').update(dto).eq('id', piece.id);
            return !error;
        } catch {
            return false;
        }
    }

    /**
     * Deletes a piece record by its ID.
     * Returns `true` if successful, otherwise `false`.
     * @param {string} id - The ID of the piece to delete.
     * @returns {Promise<boolean>}
     */
    public async deletePiece(id: string): Promise<boolean> {
        try {
            const { error } = await this.supabase.from('pieces').delete().eq('id', id);
            return !error;
        } catch {
            return false;
        }
    }
    /**
     * Filters pieces in the database based on optional criteria.
     * Supports partial name search (case-insensitive) and exact matches for other fields.
     *
     * @param {Partial<Record<string, any>>} filters - Filter criteria such as:
     * `{ name, category, brand, color, size, gender, price, condition }`
     * @returns {Promise<Array<Piece>>} - Filtered array of Piece objects.
     *
     * @example
     * const repo = new PieceRepository();
     * const filtered = await repo.filterPieces({
     *     name: "shirt",
     *     category: "SHIRT",
     *     color: "red",
     * });
     * console.log(filtered.length); // -> number of matching pieces
     */
    public async filterPieces(filters: Partial<Record<string, any>>): Promise<Array<Piece>> {
        try {
            let query = this.supabase.from('pieces').select("*");
            Object.entries(filters).forEach(([key, value]) => {
                if (value == null || value === '') return;
                if (key === 'name') {
                    query = query.ilike('name', `%${value}%`);
                }else if (key === 'category') {
                    query = query.ilike('category', `%${value}%`);
                }else if (key === 'color') {
                    query = query.ilike('color', `%${value}%`);
                }else if (key === 'brand') {
                    query = query.ilike('brand', `%${value}%`);
                }else if (key === 'gender') {
                    query = query.ilike('gender', `%${value}%`);
                }else if (key === 'size') {
                    query = query.ilike('size', `%${value}%`);
                }else if (key === 'condition') {
                    query = query.ilike('condition', `%${value}%`);
                } else {
                    query = query.eq(key, value);
                }
            });
            const { data, error } = await query;
            if (error || !data) return [];
            return data.map((item) => this.factory.makePiece(item));
        } catch {
            return [];
        }
    }
}
