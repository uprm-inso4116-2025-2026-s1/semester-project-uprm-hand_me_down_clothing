import { Location, PersistenceLocation } from "@/app/types/location";
import { ID, Name, Description, Latitude, Longitude, Address, ContactInfo, StoreHours, ThumbnailUrl } from "@/app/types/location_value_objects";

export class LocationFactory{

    //Receives a persistence formated location and returns the location in domain format.
    static toDomainFormat(rawLocation : PersistenceLocation) : Location {
        try{
            return Location.create({
                id: ID.create(rawLocation.id),
                name: Name.create(rawLocation.name),
                latitude: Latitude.create(rawLocation.latitude),
                longitude:Longitude.create(rawLocation.longitude),
                address: Address.create(rawLocation.address),
                store_hours: StoreHours.create(rawLocation.store_hours),
                description: Description.create(rawLocation.description),
                contact_info: ContactInfo.create(rawLocation.contact_info),
                thumbnailUrl: ThumbnailUrl.create(rawLocation.image),
            })
        }catch(e){
            throw new Error(`Invalid persistence record: ${(e as Error).message}`);
        }
    }
    
    static toPersistenceFormat(domainFormattedLocation : Location) : PersistenceLocation{
        const flattenedLocation: PersistenceLocation = {
            id: domainFormattedLocation.getID().toString(),
            name: domainFormattedLocation.getName(),
            latitude: domainFormattedLocation.getLatitude(),
            longitude: domainFormattedLocation.getLongitude(),
            address: domainFormattedLocation.getAddress(),
            contact_info: domainFormattedLocation.getContactInfo(),
            store_hours: domainFormattedLocation.getStoreHours(),
            description: domainFormattedLocation.getDescription(),
            image: domainFormattedLocation.getThumbnailUrl(),
        }
        return flattenedLocation;
    }

}