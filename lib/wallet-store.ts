import { create } from "zustand";
import { persist } from "zustand/middleware";

type Transaction = {
  id: string;
  type: "DEPOSIT" | "PURCHASE";
  amount: number;
  status: "pending" | "completed" | "failed";
  orderId?: string;
  description?: string;
  createdAt: string; // ISO string for localStorage serialization
};

type WalletState = {
  balance: number;
  transactions: Transaction[];
  // Actions
  setBalance: (balance: number) => void;
  addTransaction: (transaction: Omit<Transaction, "id" | "createdAt">) => void;
  deposit: (amount: number, transactionId?: string) => void;
  deduct: (amount: number, orderId: string, description?: string) => boolean;
  getBalance: () => number;
};

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      balance: 0,
      transactions: [],

      setBalance: (balance) => set({ balance }),

      addTransaction: (transaction) => {
        const newTransaction: Transaction = {
          ...transaction,
          id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
        }));
        return newTransaction;
      },

      deposit: (amount, transactionId) => {
        if (amount <= 0) return;
        const newBalance = get().balance + amount;
        set({ balance: newBalance });
        get().addTransaction({
          type: "DEPOSIT",
          amount,
          status: "completed",
          description: `Nạp tiền vào ví${transactionId ? ` - ${transactionId}` : ""}`,
        });
      },

      deduct: (amount, orderId, description) => {
        const currentBalance = get().balance;
        if (currentBalance < amount) {
          return false; // Insufficient balance
        }
        const newBalance = currentBalance - amount;
        set({ balance: newBalance });
        get().addTransaction({
          type: "PURCHASE",
          amount,
          status: "completed",
          orderId,
          description: description || `Thanh toán đơn hàng ${orderId}`,
        });
        return true;
      },

      getBalance: () => get().balance,
    }),
    {
      name: "wallet-storage",
    }
  )
);
