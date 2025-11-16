import {store_hours} from './store_hours'
import { ID, Name, Description, Latitude, Longitude, Address, ContactInfo, StoreHours, ThumbnailUrl } from './location_value_objects' 



export type PersistenceLocation= {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    address: string;
    store_hours: store_hours;
    description?: string|null;
    contact_info?: string|null;
    image?: string|null;
}

type LocationProps={
    id: ID;
    name: Name;
    description: Description; 
    latitude: Latitude;
    longitude: Longitude;
    address: Address;
    store_hours: StoreHours;
    contact_info?: ContactInfo;
    thumbnailUrl?:  ThumbnailUrl;
}

export class Location{
    //Location attributes are defined as thier own ValueObject class type since each ValueObject class type validates for invariants and type errors. This enforces a 
    //consistent construction of a Location instance.
    private constructor(
        private id: ID,
        private name: Name,
        private description: Description,
        private latitude: Latitude,
        private longitude: Longitude,
        private address: Address, 
        private store_hours: StoreHours,
        private contact_info?: ContactInfo,
        private thumbnailUrl?:  ThumbnailUrl,
    ){}

    static create(props: LocationProps) : Location{
        return new Location(
            props.id,
            props.name,
            props.description,
            props.latitude,
            props.longitude,
            props.address,
            props.store_hours,
            props.contact_info,
            props.thumbnailUrl,
        )
    }
    //getters
    getID(){ return this.id.getValue() };
    getName(){ return this.name.getValue() };
    getDescription(){ return this.description.getValue() }
    getLatitude(){ return this.latitude.getValue() }
    getLongitude(){ return this.longitude.getValue() }
    getAddress(){ return this.address.getValue() }
    getStoreHours(){ return this.store_hours.getValue() }
    getContactInfo(){ return this.contact_info?.getValue() }
    getThumbnailUrl() { return this.thumbnailUrl?.getValue() }
    
}
