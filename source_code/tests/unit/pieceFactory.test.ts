import { PieceFactory } from '@/src/factories/pieceFactory'
import { SoldPiece } from '@/app/types/sold_piece'
import { Category, Condition, Gender, Size, Status } from '@/app/types/classifications'

describe('PieceFactory', () => {
  test('creates a SoldPiece for items with price', () => {
    const factory = new PieceFactory()
    const piece = factory.makePiece({
      id: 1,
      name: 'Test Jacket',
      category: Category.JACKET,
      color: 'Black',
      brand: 'TestBrand',
      gender: Gender.UNISEX,
      size: Size.MEDIUM,
      price: 40,
      condition: Condition.USED,
      status: Status.ACTIVE,
      reason: 'Test reason',
      images: [],
      user_id: 'user123',
      latitude: null,
      longitude: null
    })
    expect(piece).toBeInstanceOf(SoldPiece)
  })
})
