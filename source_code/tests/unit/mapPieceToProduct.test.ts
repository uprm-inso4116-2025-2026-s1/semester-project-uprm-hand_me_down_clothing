import { mapPieceToProduct } from '@/src/lib/mapPieceToProduct'

describe('mapPieceToProduct', () => {
  test('maps sold piece correctly', () => {
    const piece: any = {
      name: 'Blue Jacket',
      reason: 'Very warm',
      getFormattedPrice: () => '$12.00',
      getFormattedCategory: () => 'Jackets',
      getFormattedCondition: () => 'Like New',
      getFormattedSize: () => 'M',
      getFormattedGender: () => 'Unisex',
      latitude: 18.2,
      longitude: -67.14,
      user_id: 'user123',
      images: ['https://example.com/1.jpg', 'https://example.com/2.jpg']
    }

    const result = mapPieceToProduct(piece)

    expect(result.title).toBe('Blue Jacket')
    expect(result.price).toBe('$12.00')
    expect(result.details.category).toBe('Jackets')
    expect(result.details.location).toContain('18.2000')
    expect(result.badges).toEqual(['Like New', 'M'])
  })

  test('handles missing fields gracefully', () => {
    const piece: any = {
      name: '',
      reason: null,
      getFormattedPrice: () => '$0.00',
      getFormattedCategory: () => '',
      getFormattedCondition: () => '',
      getFormattedSize: () => '',
      getFormattedGender: () => '',
      latitude: null,
      longitude: null,
      user_id: '',
      images: []
    }

    const result = mapPieceToProduct(piece)

    expect(result.title).toBe('Untitled item')
    expect(result.description).toBe('No description provided')
    expect(result.details.location).toBe('N/A')
    expect(result.badges[0]).toBe('Used')
    expect(result.badges[1]).toBe('N/A')
  })
})
