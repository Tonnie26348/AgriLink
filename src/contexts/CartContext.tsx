import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { CART_STORAGE_KEY } from "./cart-constants";
import { CartItem, CartContextType } from "./cart-types";

import { CartContext, useCart } from "./cart-context-definition";

export const CartProvider = ({ children }: { children: ReactNode }) => {