import { createClient } from '@/app/auth/supabaseClient'
import { LocationFactory } from '../factories/locationFactory'
import { Location, PersistenceLocation } from '@/app/types/location'

export class LocationRepository {
  private supabase = createClient()
  private LocationFactory = new LocationFactory()

  async fetchAllLocations (): Promise<Location[]> {
    const { data, error } = await this.supabase.from('stores').select('*')
    if (error) {
      throw new Error(`Could not fetch locations: ${error.message}`)
    }
    if (!data) {
      throw new Error('Could not fetch all locations, data not found.')
    }
    const locationRecord: Location[] = data.map(store =>
      LocationFactory.toDomainFormat(store)
    )
    return locationRecord
  }

  async fetchLocationByID (id: number): Promise<Location> {
    const { data, error } = await this.supabase
      .from('stores')
      .select('*')
      .eq('id', id.toString())
    if (error) {
      throw new Error(`Supabase error: ${error.message}`)
    }
    if (!data || data.length === 0) {
      throw new Error(`Could not fetch location by ID: ${id}. ID not found.`)
    }
    if (data.length > 1) {
      throw new Error(
        `Could not fetch location by ID. Duplicates Found found for ID: ${id}`
      )
    }
    const domainFormattedLocation: Location = LocationFactory.toDomainFormat(
      data[0]
    )

    return domainFormattedLocation
  }

  async createLocation (loc: Location): Promise<void> {
    const flattenedLocation: PersistenceLocation =
      LocationFactory.toPersistenceFormat(loc)
    const { error } = await this.supabase
      .from('stores')
      .insert([flattenedLocation])
    if (error) {
      throw new Error(`Failed to create location: ${error.message}`)
    }
    console.log(
      `Location, name: ${flattenedLocation.name},  successfully added to Supabase.`
    )
  }

  async removeLocation (loc: Location): Promise<void> {
    const flattenedLocation: PersistenceLocation =
      LocationFactory.toPersistenceFormat(loc)
    const { error } = await this.supabase
      .from('stores')
      .delete()
      .eq('id', flattenedLocation.id)
    if (error) {
      throw new Error(
        `Failed to delete location. Location ID: ${flattenedLocation.id}. \nError message: ${error.message}`
      )
    }
    console.log(`Location successfully deleted from Supabase. Location Information:\n
            ID: ${flattenedLocation.id}\n
            Name: ${flattenedLocation.name}\n
            Address: ${flattenedLocation.address}\n
            Latitude: ${flattenedLocation.latitude}\n
            Longitude: ${flattenedLocation.longitude}\n
            ContactInfo: ${flattenedLocation.contact_info}\n
            StoreHours: ${flattenedLocation.store_hours}`)
  }

  async updateLocation (loc: Location): Promise<void> {
    const flattenedLocation: PersistenceLocation =
      LocationFactory.toPersistenceFormat(loc)
    const { data, error } = await this.supabase
      .from('stores')
      .update(flattenedLocation)
      .eq('id', flattenedLocation.id)
      .select()
    if (error) {
      throw new Error(
        `Could not update location. ID: ${flattenedLocation.id}. ${error.message}`
      )
    }
    if (data.length === 0) {
      throw new Error(
        `Could not update location. Location not found in Supabase.`
      )
    }
    console.log(`Location ${flattenedLocation.id} was successfully updated.`)
  }
}
