export interface SignInFormProps {
  type: 'sign-in' | 'sign-up';
}

export interface Config {
  ORDER_URL: 'https://65.21.6.50/order';
  AUTH_URL: 'https://65.21.6.50/auth';
  CONSUMER_URL: 'https://65.21.6.50/product';
  ORCHESTRATION_URL: 'https://65.21.6.50/orchestration';
}

export interface CartItem {
  id: string;
  name: string;
  parentId: string;
}
