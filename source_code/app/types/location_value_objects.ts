//Give summary of whats happening in this folder.

import { store_hours } from "@/app/types/store_hours";

export class ID{
    private constructor(private value:number){}

    static create(value : string) : ID{
        if(!value){
            throw new Error("ID cannot be empty.")
        }
        if(!/^\d+$/.test(value)){
             throw new Error("ID must only contain numbers.");
        }
        return new ID(Number(value))
    }
    
    getValue() : number { return this.value }
}

export class Name{
    private constructor(private readonly value: string){}

    static create(value: string): Name{
        if(!value || value.trim().length===0){
            throw new Error("Name is empty");
        }
        return new Name(value.trim());
    }

    getValue() : string { return this.value; }
}

export class Latitude{
    private constructor(private value: number){}

    static create(value: number) : Latitude{
        if(value==null){
            throw new Error("Latitude is required.")
        }
        if(typeof value!== "number"){
            throw new Error("Latitude must be a number.")
        }
        if(!(-90<=value && value<=90)){
            throw new Error("Value is not within the latitude range. (-90<=latitude<=90)");
        }
        return new Latitude(value)
    }
    getValue() : number { return this.value }
}

export class Longitude{
    private constructor(private value: number){}

    static create(value:number) : Longitude{
        if(value==null){
            throw new Error("Longitude is required.")
        }
        if(typeof value!== "number"){
            throw new Error("Longitude must be a number.")
        }
        if(!(-180<= value && value<=180)){
            throw new Error("Value not within Longitude range (-180<=longitude<=180).");
        }
        return new Longitude(value)
    }
    getValue() : number { return this.value; }
}

export class Address{
    private constructor(private value: string){}

    static create(value: string) : Address{
        if(!value || value.trim().length===0){
            throw new Error("Address cannot be empty.")
        }
        return new Address(value.trim());
    }
    
    getValue() : string { return this.value }
}

export class ContactInfo{
    private constructor(private value:string|null){}

    static create(value:string|null|undefined) : ContactInfo{
        
        if(!value){
            return new ContactInfo(null)
        }

        const clean_value : string = value.trim().replace(/-/g,"");
        if(!value || clean_value.length===0){
            throw new Error("Contact information cannot be empty.");
        }
        if(clean_value.length!=10){
            throw new Error("Contact must contain 10 numbers.");
        }
        if(!/^\d{10}$/.test(clean_value)){
             throw new Error("Contact information must only contain numbers.");
        }
        const formatted_value : string= clean_value.slice(0,3)+'-'+clean_value.slice(3,6)+'-'+clean_value.slice(6,10);
        return new ContactInfo(formatted_value);
    }
    getValue() : string|null|undefined { return this.value }
} 

export class StoreHours{
    private constructor(private value: store_hours){}

    static create(value: store_hours) : StoreHours{
        if(!value){
            throw new Error("Store hours cannot be empty.")
        }
        return new StoreHours(value)
    }

    getValue() : store_hours { return this.value }
}

export class Description{
    private constructor(private value: string|null|undefined){}

    static create(value:string|null|undefined) : Description{
        if(!value || value.trim().length===0){
            return new Description(null)
        }
        return new Description(value.trim());
    }
    
    getValue() : string|null|undefined { return this.value }
}

export class ThumbnailUrl{
    private constructor(private value : string|null|undefined){}

    static create(value : string|null|undefined) : ThumbnailUrl{
        return new ThumbnailUrl(value);
    }
    
    getValue() : string|null|undefined { return this.value }
}