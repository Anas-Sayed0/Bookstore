export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  stock: number;
  averageRating?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  orderDate: string | Date;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  totalPrice: number;
  items: {
    id: string;
    quantity: number;
    price: number;
    book: {
      id: string;
      title: string;
      rating?: number;
      averageRating?: number;
    };
  }[];
}

export interface PaymentDetails {
  cardNumber: string;
  cardPassword: string;
  totalPrice: number;
}
