import { Order } from 'app/utils/types';
import { useEffect, useState } from 'react';

import { boundary } from '@shopify/shopify-app-react-router/server';

import { authenticate } from '../shopify.server';

import type { HeadersFunction, LoaderFunctionArgs } from "react-router";
export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return null;
};

export default function Index() {
  const [orders, setOrders] = useState<Array<Order>>([]);
  const [selectedMessage, setSelectedMessage] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getOrders = async () => {
      const response = await fetch(`${process.env.API_BASE_URL}/fetchOrders`);
      const data = (await response.json()) as { orders: Array<Order> };
      setOrders(data.orders);
    };
    getOrders();
  }, []);

  const handleDeleteMessage = async () => {
    if (!selectedMessage) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.API_BASE_URL}/deleteMessage`,
        {
          method: "POST",
          body: JSON.stringify({ orderId: selectedMessage.id }),
        },
      );
      if (response.ok) {
        const response = await fetch(`${process.env.API_BASE_URL}/fetchOrders`);
        const data = (await response.json()) as { orders: Array<Order> };
        setOrders(data.orders);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error deleting message:", error);
      setLoading(false);
      return;
    }
  };

  return (
    <s-page heading="Video Message App">
      <s-section heading="List of orders with video message">
        <s-table>
          <s-table-header-row>
            <s-table-header listSlot="primary">Order #</s-table-header>
            <s-table-header listSlot="secondary">Order Created</s-table-header>
            <s-table-header listSlot="labeled">Recorded</s-table-header>
            <s-table-header listSlot="labeled">Opened</s-table-header>
            <s-table-header></s-table-header>
          </s-table-header-row>
          <s-table-body>
            {orders.length > 0
              ? orders.map((order, index) => (
                  <s-table-row key={index}>
                    <s-table-cell>{order.orderName}</s-table-cell>
                    <s-table-cell>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : ""}
                    </s-table-cell>
                    <s-table-cell>
                      {order.messageStatus === "RECORDED" ||
                      order.messageStatus === "OPENED" ? (
                        <s-icon type="check-circle" tone="success" />
                      ) : (
                        <s-icon type="x-circle" tone="critical" />
                      )}
                    </s-table-cell>
                    <s-table-cell>
                      {order.messageStatus === "OPENED" ? (
                        <s-icon type="check-circle" tone="success" />
                      ) : (
                        <s-icon type="x-circle" tone="critical" />
                      )}
                    </s-table-cell>
                    <s-table-cell>
                      <s-button
                        icon="edit"
                        variant="tertiary"
                        commandFor="video-modal"
                        accessibilityLabel="Edit Video Message Details"
                        onClick={() => setSelectedMessage(order)}
                      />
                    </s-table-cell>
                  </s-table-row>
                ))
              : null}
          </s-table-body>
        </s-table>
      </s-section>

      <s-modal
        id="video-modal"
        heading="View Details"
        accessibilityLabel="View Video Message Details"
      >
        <s-grid gridTemplateColumns="repeat(2, 1fr)" gap="small">
          <s-grid-item gridColumn="span 1">
            <s-text-field
              value={selectedMessage?.firstName || ""}
              label="First Name"
              labelAccessibilityVisibility="visible"
              disabled
            />
          </s-grid-item>
          <s-grid-item gridColumn="span 1">
            <s-text-field
              value={selectedMessage?.lastName || ""}
              label="Last Name"
              labelAccessibilityVisibility="visible"
              disabled
            />
          </s-grid-item>

          <s-grid-item gridColumn="span 1">
            <s-text-field
              value={selectedMessage?.customerEmail || ""}
              label="Email"
              labelAccessibilityVisibility="visible"
              disabled
            />
          </s-grid-item>

          <s-grid-item gridColumn="span 1">
            <s-text-field
              value={selectedMessage?.orderName || ""}
              label="Order #"
              labelAccessibilityVisibility="visible"
              disabled
            />
          </s-grid-item>

          {selectedMessage?.messageStatus === "RECORDED" ? (
            <s-grid-item gridColumn="span 2">
              <s-button
                accessibilityLabel="Delete Video Message"
                onClick={handleDeleteMessage}
                loading={loading}
              >
                Delete video message
              </s-button>
            </s-grid-item>
          ) : null}
        </s-grid>
      </s-modal>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
