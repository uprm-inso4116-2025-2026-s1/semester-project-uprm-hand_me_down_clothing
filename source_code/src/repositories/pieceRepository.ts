import { Piece } from "@/app/types/piece";
import { createClient } from '@/app/utils/supabase/client'
import { PieceFactory } from "../factories/pieceFactory";
import { Category, Condition, Gender, Size, Status } from "@/app/types/classifications";
import { PieceSpecification } from "../specifications/piece_specifications";

// Maximum character lengths for specific filter fields
const FIELD_MAX_LENGTHS: Record<string, number> = {
    name: 100,           // Item name/description
    color: 20,           // Color name
    brand: 50,           // Brand name
    category: 30,        // Category type
    gender: 10,          // Gender classification
    size: 10,            // Size designation
    condition: 15,       // Condition description
    status: 15,          // Status type
    // Default fallback for any other fields
    default: 150
};

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
    private supabase;

    constructor(supabaseClient = createClient()) {
        this.supabase = supabaseClient;
    }

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
        const missing: string[] = [];
        if (piece.id == null || piece.id < 0) missing.push('id');
        if (!piece.name || piece.name.trim().length === 0) missing.push('name');
        if (!piece.brand || piece.brand.trim().length === 0) missing.push('brand');
        if (!piece.user_id || piece.user_id.trim().length === 0) missing.push('user_id');

        if (missing.length > 0) {
            throw new Error('Piece validation failed: missing ' + missing.join(', '));
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
        } catch (e) {
            return Error('Invalid data for piece: ' + piece.toString());
        }

        const dto = this.factory.toDTO(piece);
        delete dto.id;
        const { data, error } = await this.supabase.from('pieces').insert([dto]).select().single();
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
     * Closes a listing by updating its status in the database.
     *
     * This operation transitions a Piece into a terminal state such as SOLD, DONATED,
     * or RETRACTED. A successful update returns the updated Piece domain object
     * constructed through the PieceFactory. If the update fails, the Supabase error
     * is returned instead.
     *
     * @param {number} id - The ID of the listing to close.
     * @param {Status} status - The terminal status to apply (SOLD, DONATED, or RETRACTED).
     * @returns {Promise<Piece | Error>} - The updated Piece if successful, or an Error on failure.
     *
     * @example
     * const repo = new PieceRepository();
     * await repo.closeListing(12, Status.SOLD);       // marks piece as sold
     * await repo.closeListing(15, Status.DONATED);    // marks piece as donated
     * await repo.closeListing(18, Status.RETRACTED);  // removes item from circulation
     */
    public async closeListing(id: number, status: Status): Promise<Piece | Error> {
        const { data, error } = await this.supabase.from('pieces').update({ status: Status[status] }).eq('id', id).select().single();
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
            const { data, error } = await this.supabase.from('pieces').delete().eq('id', id).select();
            if (error) return false;
            return Array.isArray(data) ? data.length > 0 : !!data;
        } catch {
            return false;
        }
    }
    /**
     * Filters pieces in the database based on optional criteria.
     * Supports partial name search (case-insensitive) and exact matches for other fields.
     * Filter values are limited to 150 characters for performance and security.
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
            let query: any = this.supabase.from('pieces').select('*');

            const searchFields = ['name', 'category', 'color', 'brand', 'gender', 'size', 'condition', 'status'];

            Object.entries(filters).forEach(([key, value]) => {
                if (value == null || value === '') return;
                
                // Validate string length for security and performance with field-specific limits
                if (typeof value === 'string') {
                    const maxLength = FIELD_MAX_LENGTHS[key] || FIELD_MAX_LENGTHS.default;
                    if (value.length > maxLength) {
                        console.warn(`Filter value for "${key}" exceeds maximum length of ${maxLength} characters. Truncating.`);
                        value = value.substring(0, maxLength);
                    }
                }

                if (searchFields.includes(key)) {
                    query = query.ilike(key, `%${value}%`);
                    return;
                }

                query = query.eq(key, value);
            });

            const { data, error } = await query;
            if (error || !data) return [];
            return data.map((item : Record<string, any>) => this.factory.makePiece(item));
        } catch {
            return [];
        }
    }

    /**
     * Deletes one or more image files from Supabase Storage.
     * Used when a user removes images during edit.
     * @param {string[]} imagePaths - Array of image storage paths.
     * @returns {Promise<boolean>} - True if all deletions succeeded.
     */
    public async deleteImages(imagePaths: string[]): Promise<boolean> {
        if (!imagePaths || imagePaths.length === 0) return true;

        const { error } = await this.supabase.storage
            .from("piece_images")        // your bucket name
            .remove(imagePaths);

        return error == null;
    }

    /**
     * Validates if more images can be added based on current count and max limit
     */
    public canAddMoreImages(currentImages: string[], maxImages: number): boolean {
        return currentImages.length < maxImages;
    }

    /**
     * Validates piece form data and returns error message or null if valid
     */
    public validatePieceFormData(
        imageUrls: string[],
        city: string,
        handoff: string,
        title: string,
        category: string,
        condition: string,
        size: string,
        sex: string,
        quantity: number,
        maxImages: number
        ): string | null {
        if (!imageUrls || imageUrls.length === 0) {
            return 'Please upload at least one image.';
        }
        if (imageUrls.length > maxImages) {
            return `Maximum ${maxImages} images allowed.`;
        }
        if (!city.trim()) {
            return 'Please enter a city.';
        }
        if (!handoff) {
            return 'Please select a handoff method.';
        }
        if (!title.trim()) {
            return 'Please enter an item name.';
        }
        if (!category) {
            return 'Please select a category.';
        }
        if (!condition) {
            return 'Please select a condition.';
        }
        if (!size) {
            return 'Please select a size.';
        }
        if (!sex) {
            return 'Please select a gender.';
        }
        if (quantity < 1) {
            return 'Quantity must be at least 1.';
        }
        return null;
    }
}
