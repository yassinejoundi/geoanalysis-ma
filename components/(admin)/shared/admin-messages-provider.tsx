"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { AdminMessage } from "@/lib/content/admin";

type AdminMessagesValue = {
  messages: AdminMessage[];
  setMessages: Dispatch<SetStateAction<AdminMessage[]>>;
};

const AdminMessagesContext = createContext<AdminMessagesValue | null>(null);

export function AdminMessagesProvider({ children, initialMessages }: { children: ReactNode; initialMessages: AdminMessage[] }) {
  const [messages, setMessages] = useState<AdminMessage[]>(initialMessages);
  const value = useMemo(() => ({ messages, setMessages }), [messages]);

  return (
    <AdminMessagesContext.Provider value={value}>
      {children}
    </AdminMessagesContext.Provider>
  );
}

export function useAdminMessages() {
  const context = useContext(AdminMessagesContext);
  if (!context) throw new Error("Admin messages require AdminMessagesProvider.");
  return context;
}
