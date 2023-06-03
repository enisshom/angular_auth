export class Property{
    id:number
    property:string
    roles:Role[]
  }
  export class Role{
    role:string
    permissions:string[]
  }
  
  
  export class DataToken {
    email: string;
    userId: number;
    username: string;
    service: string;
    properties: Property[];
    propertyIds: number[];
    permissions: string[];
    roles: Role[];
    date_exp:number;
  }