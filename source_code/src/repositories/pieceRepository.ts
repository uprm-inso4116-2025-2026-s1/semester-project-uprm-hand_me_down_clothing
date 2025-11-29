import { Piece } from '@/app/types/piece'
import { createClient } from '@/app/auth/supabaseClient'
import { PieceFactory } from '../factories/pieceFactory'
import { Category, Condition, Gender, Size } from '@/app/types/classifications'

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
  private factory = new PieceFactory()
  private supabase = createClient()

  /**
   * Retrieves all pieces from the Supabase 'pieces' table.
   */
  public async getPieces(): Promise<Array<Piece>> {
    try {
      const res = await this.supabase.from('pieces').select('*')
      const rows = res.data
      if (!rows) return []
      return rows.map((item: Record<string, any>) => this.factory.makePiece(item))
    } catch {
      return []
    }
  }

  /**
   * Retrieves a piece by ID.
   */
  public async getPieceById(id: number): Promise<Piece | null> {
    try {
      const { data, error } = await this.supabase
        .from('pieces')
        .select('*')
        .eq('id', id)
        .single()
      if (error || !data) return null
      return this.factory.makePiece(data)
    } catch {
      return null
    }
  }

  /**
   * Retrieves all pieces for a user.
   */
  public async getPiecesByUser(user_id: string): Promise<Array<Piece>> {
    try {
      const res = await this.supabase.from('pieces').select('*').eq('user_id', user_id)
      const rows = res.data
      if (!rows) return []
      return rows.map((item: Record<string, any>) => this.factory.makePiece(item))
    } catch {
      return []
    }
  }

  private validatePieceData(piece: Piece) {
    let missing = ''
    if (piece.id < 0) missing += 'id '
    if (piece.name.length < 0) missing += 'name '
    if (piece.brand.length < 0) missing += 'brand '
    if (!piece.user_id) missing += 'user_id'
    if (missing.trim().length > 0) {
      throw new Error('Piece validation failed: missing ' + missing)
    }
  }

  /**
   * Inserts a new piece record into the database.
   */
  public async createPiece(piece: Piece): Promise<Piece | Error> {
    try {
      this.validatePieceData(piece)
    } catch {
      return Error('Invalid data for piece: ' + piece.toString())
    }
    const { data, error } = await this.supabase
      .from('pieces')
      .insert([
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
          user_id: piece.user_id,
        },
      ])
      .select()
      .single()
    if (error != null) return error
    return this.factory.makePiece(data)
  }

  /**
   * Updates an existing piece record.
   */
  public async updatePiece(piece: Piece): Promise<Piece | Error> {
    try {
      this.validatePieceData(piece)
    } catch {
      return Error('Invalid data for piece: ' + piece.toString())
    }
    const dto = this.factory.toDTO(piece)
    const { data, error } = await this.supabase
      .from('pieces')
      .update(dto)
      .eq('id', piece.id)
      .select()
      .single()
    if (error) return error
    return this.factory.makePiece(data)
  }

  /**
   * Deletes a piece by ID.
   */
  public async deletePiece(id: number): Promise<boolean> {
    try {
      const res = await this.supabase.from('pieces').delete().eq('id', id).select()
      return res.data != null && res.data.length > 0
    } catch {
      return false
    }
  }

  /**
   * Filters pieces using optional criteria with safe lengths and ilike for text fields.
   */
  public async filterPieces(
    filters: Partial<Record<string, any>>
  ): Promise<Array<Piece>> {
    try {
      let query: any = this.supabase.from('pieces').select('*')
      const searchFields = ['name', 'category', 'color', 'brand', 'gender', 'size', 'condition', 'status']
      Object.entries(filters).forEach(([key, raw]) => {
        if (raw == null || raw === '') return
        let value: any = raw
        if (typeof value === 'string') {
          const max = FIELD_MAX_LENGTHS[key] ?? FIELD_MAX_LENGTHS.default
          if (value.length > max) value = value.substring(0, max)
        }
        if (searchFields.includes(key)) {
          query = query.ilike(key, `%${value}%`)
        } else {
          query = query.eq(key, value)
        }
      })
      const { data, error } = await query
      if (error || !data) return []
      return data.map((item: Record<string, any>) => this.factory.makePiece(item))
    } catch {
      return []
    }
  }

  /**
   * Deletes one or more image files from Supabase Storage bucket 'piece_images'.
   */
  public async deleteImages(imagePaths: string[]): Promise<boolean> {
    if (!imagePaths || imagePaths.length === 0) return true
    const { error } = await this.supabase.storage.from('piece_images').remove(imagePaths)
    return error == null
  }

  /**
   * Validates if more images can be added based on current count and max limit.
   */
  public canAddMoreImages(currentImages: string[], maxImages: number): boolean {
    return (currentImages?.length ?? 0) < maxImages
  }

  /**
   * Basic form validation reused by edit/create listing flows.
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
    if (!imageUrls || imageUrls.length === 0) return 'Please upload at least one image.'
    if (imageUrls.length > maxImages) return `Maximum ${maxImages} images allowed.`
    if (!city.trim()) return 'Please enter a city.'
    if (!handoff) return 'Please select a handoff method.'
    if (!title.trim()) return 'Please enter an item name.'
    if (!category) return 'Please select a category.'
    if (!condition) return 'Please select a condition.'
    if (!size) return 'Please select a size.'
    if (!sex) return 'Please select a gender.'
    if (quantity < 1) return 'Quantity must be at least 1.'
    return null
  }
}
