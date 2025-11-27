import type { Piece } from '@/app/types/piece'

export type ProductShape = {
  title: string
  categoryTrail: string[]
  description: string
  price: string
  badges: string[]
  tags: string[]
  details: {
    category: string
    location: string
    condition: string
    size: string
  }
  donor: {
    initials: string
    name: string
    rating: number | null
    stats: string
    response: string
  }
}

export function mapPieceToProduct(piece: Piece): ProductShape {
  const title = piece.name || 'Untitled item'
  const category = piece.getFormattedCategory?.() || 'Category'
  const description = piece.reason || 'No description provided'
  const price = piece.getFormattedPrice?.() || '$0.00'
  const badges = [piece.getFormattedCondition?.() || 'Used', piece.getFormattedSize?.() || 'N/A']
  const tags = [piece.getFormattedGender?.() || 'Unisex']
  const location = piece.latitude != null && piece.longitude != null ? `${piece.latitude.toFixed(4)}, ${piece.longitude.toFixed(4)}` : 'N/A'

  return {
    title,
    categoryTrail: ['Home', category],
    description,
    price,
    badges,
    tags,
    details: {
      category,
      location,
      condition: piece.getFormattedCondition?.() || 'N/A',
      size: piece.getFormattedSize?.() || 'N/A'
    },
    donor: {
      initials: (piece.user_id && piece.user_id.slice(0,1).toUpperCase()) || 'U',
      name: piece.user_id || 'Unknown',
      rating: null,
      stats: 'N/A',
      response: 'N/A'
    }
  }
}
