import { createContext } from "react";   

export type ProductsDetailsDataType = {
    id?: string;
    title: string;
    description: string;
    foodImage?: string;
    category: string;
    price: string;
  };
  
export type CartDataType = {
    user: string,
    id: string;
    title: string;
    foodImage?: string;
    price: number;
    quantity: number;
  };

  export const initialDataProductsDetails: ProductsDetailsDataType = {
    id: "",
    title: "",
    description: "",
    foodImage: "",
    category: "",
    price: "",
  };
export type CartBasicInfoProps ={   
  itemQuantity: number;
  setItemQuantity : React.Dispatch<React.SetStateAction<number>>;
  foodItem: ProductsDetailsDataType;
  setFoodItem : React.Dispatch<React.SetStateAction<ProductsDetailsDataType>>;
  cartItem: CartDataType[]; 
  setCartItem: React.Dispatch<React.SetStateAction<CartDataType[]>>; 
  updateCart: boolean;
  setUpdateCart: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddToCart: (event: React.MouseEvent<HTMLButtonElement>) => void;
  };

 
export const CartContext = createContext<CartBasicInfoProps | null>(null);