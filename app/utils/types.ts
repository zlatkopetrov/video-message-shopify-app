export type Order = {
  id: string | null;
  shopifyOrderId: string | null;
  orderName: string | null;
  orderNumber: number | null;
  orderConfirmationNumber: string | null;
  userId: string | null;
  customerEmail: string | null;
  firstName: string | null;
  lastName: string | null;
  messageStatus: "EMPTY" | "RECORDED" | "OPENED" | null;
  itemCount: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};
