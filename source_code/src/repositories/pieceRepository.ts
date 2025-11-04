import { Piece } from "@/app/types/piece";
import { createClient } from '@/app/utils/supabase/client'
import { PieceFactory } from "../factories/pieceFactory";
import { Category, Condition, Gender, Size } from "@/app/types/classifications";

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
        let missing = '';
        if (piece.id < 0) {
            missing += "id "
        }
        if (piece.name.length < 0) {
            missing += "name "
        }
        if (piece.brand.length < 0) {
            missing += "brand "
        }
        if (!piece.user_id) {
            missing += "user_id"
        }
        if(missing.trim().length > 0){
            throw new Error("Piece validation failed: missing " + missing);
        }
    }


    /**
     * Retrieves a piece by its ID from the database.
     * @param {number} id - The ID of the piece to retrieve.
     * @returns {Promise<Piece | null>} - The Piece object if found, otherwise null.
     */
    public async getPieceById(id: number): Promise<Piece | null> {
        try {
            const { data, error } = await this.supabase.from('pieces').select("*").eq('id', id).single();
            if (error || !data) return null;
            return this.factory.makePiece(data);
        } catch {
            return null;
        }
    }

    /**
     * Retrieves all pieces corresponding to a user from the Supabase 'pieces' table.
     * @param {String} user_id - The ID of the user whose pieces we want.
     * @returns {Promise<Array<Piece>>} - An array of Piece objects.
     */
    public async getPiecesByUser(user_id : String): Promise<Array<Piece>> {
        try {
            const pieces_data = (await this.supabase.from('pieces').select("*").eq('user_id', user_id)).data;
            if (!pieces_data) return [];
            const pieces = pieces_data.map((item) => this.factory.makePiece(item));
            return pieces;
        } catch {
            return [];
        }
    }
    

    /**
     * Inserts a new piece record into the database.
     * Returns the newly created Piece if successful, otherwise the error that impeded the creation.
     * @param {Piece} piece - The piece object to create.
     * @returns {Promise<Piece | Error>}
     */
    public async createPiece(piece: Piece): Promise<Piece | Error> {
        try {
            this.validatePieceData(piece);
        } catch {
            return Error("Invalid data for piece: " + piece.toString());
        }
        // TODO: convert dto
        // const dto = this.factory.toDTO(piece);
        const { data, error } = await this.supabase.from('pieces').insert([
            // dto
            {
            name: piece.name,
            category: Category[piece.category],
            color: piece.color,
            brand: piece.brand,
            gender: Gender[piece.gender],
            size: Size[piece.size],
            price: piece.price,
            condition: Condition[piece.condition],
            reason: piece.reason,
            images: piece.images,
            user_id: piece.user_id
        }
    ]).select().single();
        if (error != null) return error;
        return this.factory.makePiece(data);
    }

    /**
     * Updates an existing piece record.
     * Returns the updated Piece if successful, otherwise null.
     * @param {Piece} piece - The piece object to update.
     * @returns {Promise<Piece | Error>}
     */
    public async updatePiece(piece: Piece): Promise<Piece | Error> {
        try {
            this.validatePieceData(piece);
        } catch {
            return Error("Invalid data for piece: " + piece.toString());
        }
        const dto = this.factory.toDTO(piece);
        const { data, error } = await this.supabase.from('pieces').update(dto).eq('id', piece.id).select().single();
        if (error) return error;
        return this.factory.makePiece(data);
    }

    /**
     * Deletes a piece record by its ID.
     * Returns `true` if successful, otherwise `false`.
     * @param {number} id - The ID of the piece to delete.
     * @returns {Promise<boolean>}
     */
    public async deletePiece(id: number): Promise<boolean> {
        try {
            const error  = await this.supabase.from('pieces').delete().eq('id', id).select();
            return error.data != null && error.data.length > 0;
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
                if (key === 'name' || key === ' category' || key === 'color' || key === 'brand' || key === 'gender' || key === 'size' || key === 'condition') {
                    query = query.ilike('name', `%${value}%`);
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
