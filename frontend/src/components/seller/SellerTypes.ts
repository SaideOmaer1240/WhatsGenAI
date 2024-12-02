export interface Seller {
    id: number;
    sellerName: string;
    product: string;
    description: string;
    benefits: string;
    image?: string;
    sessionId: string;
    createdAt: string;
}

export interface SellerFormInputs {
    sessionId: string;
    sellerName: string;
    product: string;
    description: string;
    benefits: string;
    image?: File | string; 
  }
  

export  interface Session {
    id: number;
    sessionId: string;
    createdAt: string;
}
