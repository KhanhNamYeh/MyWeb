import React, { useState, useEffect } from "react";
import "./AdminOrderManagement.css";

const AdminOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ type: "", message: "" });

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost/PHP/admin_orders.php", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "get_orders"
          }),
        });

        const data = await response.json();
        if (data.success) {
          setOrders(data.orders);
        } else {
          setError(data.error || "Failed to fetch orders");
        }
      } catch (err) {
        setError("Error connecting to server");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Toggle expanded order details
  const toggleOrderDetails = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch("http://localhost/PHP/admin_orders.php", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "update_order_status",
          order_id: orderId,
          status: status
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Update order in state
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: status } : order
        ));
        setStatusMessage({ type: "success", message: "Order status updated successfully" });
        
        // Clear message after delay
        setTimeout(() => {
          setStatusMessage({ type: "", message: "" });
        }, 3000);
      } else {
        setStatusMessage({ type: "error", message: data.error || "Failed to update order status" });
      }
    } catch (error) {
      setStatusMessage({ type: "error", message: "Error connecting to server" });
      console.error("Error:", error);
    }
  };

  // Delete order
  const deleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch("http://localhost/PHP/admin_orders.php", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "delete_order",
          order_id: orderId
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Remove order from state
        setOrders(orders.filter(order => order.id !== orderId));
        setStatusMessage({ type: "success", message: "Order deleted successfully" });
        
        // Clear message after delay
        setTimeout(() => {
          setStatusMessage({ type: "", message: "" });
        }, 3000);
      } else {
        setStatusMessage({ type: "error", message: data.error || "Failed to delete order" });
      }
    } catch (error) {
      setStatusMessage({ type: "error", message: "Error connecting to server" });
      console.error("Error:", error);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="admin-ordermanage-loading-container">
        <div className="admin-ordermanage-spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="admin-ordermanage-error-container">
        <p>Error loading orders: {error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="admin-ordermanage-container">
      <div className="admin-ordermanage-header">
        <h2>Order Management</h2>
      </div>

      {statusMessage.message && (
        <div className={`admin-ordermanage-status-message ${statusMessage.type}`}>
          {statusMessage.message}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="admin-ordermanage-no-orders">
          <p>No orders found</p>
        </div>
      ) : (
        <div className="admin-ordermanage-table-container">
          <table className="admin-ordermanage-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr>
                    <td>#{order.id}</td>
                    <td>
                      <div>{order.user_name}</div>
                      <div className="admin-ordermanage-email">{order.user_email}</div>
                    </td>
                    <td>{parseInt(order.total).toLocaleString()} VND</td>
                    <td>
                      <select
                        className={`admin-ordermanage-status-select admin-ordermanage-status-${order.status.toLowerCase()}`}
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <div className="admin-ordermanage-actions">
                        <button 
                          className="admin-ordermanage-view-btn"
                          onClick={() => toggleOrderDetails(order.id)}
                        >
                          {expandedOrderId === order.id ? "Hide Details" : "View Details"}
                        </button>
                        <button 
                          className="admin-ordermanage-delete-btn"
                          onClick={() => deleteOrder(order.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedOrderId === order.id && (
                    <tr className="admin-ordermanage-expanded-row">
                      <td colSpan="5">
                        <div className="admin-ordermanage-order-details">
                          <h4>Order Items</h4>
                          <table className="admin-ordermanage-items-table">
                            <thead>
                              <tr>
                                <th>Item</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.items.map((item) => (
                                <tr key={item.id}>
                                  <td>{item.book_title}</td>
                                  <td>{parseInt(item.price).toLocaleString()} VND</td>
                                  <td>{item.quantity}</td>
                                  <td>{(parseInt(item.price) * item.quantity).toLocaleString()} VND</td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr>
                                <td colSpan="3" className="admin-ordermanage-total-label">Total</td>
                                <td className="admin-ordermanage-total-value">{parseInt(order.total).toLocaleString()} VND</td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrderManagement;