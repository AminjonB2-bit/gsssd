export interface WithdrawalRequest {
  id: string;
  amount: number;
  type: 'SOL' | 'DFIRE';
  address: string;
  timestamp: number;
  status: 'pending' | 'sent';
}

