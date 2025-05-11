export interface SignInFormProps {
    type: 'sign-in' | 'sign-up';
}

export interface Config {
    ORDER_URL: "http://localhost:8080"
    AUTH_URL: 'localhost:8086';
    CONSUMER_URL: 'localhost:9292'
}

export interface CartItem {
  id: string;
  name: string;
  parentId: string;
}