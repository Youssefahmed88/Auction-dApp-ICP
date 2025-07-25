"use client"

import { useState } from "react"
import { Actor, HttpAgent } from "@dfinity/agent"
import { idlFactory, canisterId } from "../../declarations/auction_dapp_backend"

const agent = new HttpAgent()
if (process.env.DFX_NETWORK === "local") {
  agent.fetchRootKey()
}

const auctionActor = Actor.createActor(idlFactory, {
  agent,
  canisterId,
})

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "20px",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  wrapper: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  header: {
    textAlign: "center",
    padding: "32px 0",
    color: "white",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    margin: "0 0 8px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
  },
  subtitle: {
    fontSize: "1.1rem",
    opacity: "0.9",
    margin: "0",
  },
  alert: {
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  alertSuccess: {
    backgroundColor: "#d1fae5",
    border: "1px solid #10b981",
    color: "#065f46",
  },
  alertError: {
    backgroundColor: "#fee2e2",
    border: "1px solid #ef4444",
    color: "#991b1b",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "24px",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    overflow: "hidden",
  },
  cardHeader: {
    padding: "20px 24px 16px",
    borderBottom: "1px solid #e5e7eb",
  },
  cardTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    margin: "0 0 4px 0",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  cardDescription: {
    color: "#6b7280",
    fontSize: "0.9rem",
    margin: "0",
  },
  cardContent: {
    padding: "24px",
  },
  formGroup: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    fontSize: "0.9rem",
    fontWeight: "500",
    marginBottom: "6px",
    color: "#374151",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "0.9rem",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  },
  inputFocus: {
    outline: "none",
    borderColor: "#3b82f6",
    boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
  },
  button: {
    width: "100%",
    padding: "12px 16px",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "0.9rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s",
    marginTop: "8px",
  },
  buttonHover: {
    backgroundColor: "#2563eb",
  },
  buttonDisabled: {
    backgroundColor: "#9ca3af",
    cursor: "not-allowed",
  },
  buttonGreen: {
    backgroundColor: "#10b981",
  },
  buttonRed: {
    backgroundColor: "#ef4444",
  },
  buttonPurple: {
    backgroundColor: "#8b5cf6",
  },
  buttonIndigo: {
    backgroundColor: "#6366f1",
  },
  gridTwo: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  badge: {
    display: "inline-block",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "0.75rem",
    fontWeight: "500",
  },
  badgeActive: {
    backgroundColor: "#dbeafe",
    color: "#1e40af",
  },
  badgeInactive: {
    backgroundColor: "#f3f4f6",
    color: "#6b7280",
  },
  itemCard: {
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderLeft: "4px solid #6366f1",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "12px",
  },
  itemHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "8px",
  },
  itemTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    margin: "0",
  },
  itemDescription: {
    color: "#6b7280",
    marginBottom: "12px",
  },
  itemFooter: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.9rem",
  },
  emptyState: {
    textAlign: "center",
    padding: "48px 24px",
    color: "#6b7280",
  },
  icon: {
    width: "20px",
    height: "20px",
  },
  itemId: {
    fontSize: "0.8rem",
    color: "#6b7280",
    fontFamily: "monospace",
    backgroundColor: "#f3f4f6",
    padding: "2px 6px",
    borderRadius: "4px",
    marginBottom: "8px",
    display: "inline-block",
  },
  searchResult: {
    backgroundColor: "#f0f9ff",
    border: "1px solid #0ea5e9",
    borderRadius: "8px",
    padding: "16px",
    marginTop: "16px",
  },
}

export default function App() {
  const [items, setItems] = useState([])
  const [newItem, setNewItem] = useState({
    key: "",
    name: "",
    description: "",
    starting_price: "",
    is_active: true,
  })
  const [bidInfo, setBidInfo] = useState({ key: "", amount: "" })
  const [endKey, setEndKey] = useState("")
  const [getKey, setGetKey] = useState("")
  const [fetchedItem, setFetchedItem] = useState(undefined)
  const [loading, setLoading] = useState({
    create: false,
    bid: false,
    end: false,
    get: false,
    list: false,
  })
  const [message, setMessage] = useState({ type: "", text: "" })

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: "", text: "" }), 5000)
  }

  // Create item
  const handleCreate = async () => {
    if (!newItem.key || !newItem.name || !newItem.starting_price) {
      showMessage("error", "Please fill in all required fields")
      return
    }

    setLoading({ ...loading, create: true })
    try {
      const item = {
        name: newItem.name,
        description: newItem.description,
        starting_price: Number.parseFloat(newItem.starting_price),
        is_active: newItem.is_active,
      }
      await auctionActor.create_item(BigInt(newItem.key), item)
      showMessage("success", "Item created successfully!")
      setNewItem({ key: "", name: "", description: "", starting_price: "", is_active: true })
    } catch (error) {
      showMessage("error", "Failed to create item: " + error.message)
    }
    setLoading({ ...loading, create: false })
  }

  // Bid
  const handleBid = async () => {
    if (!bidInfo.key || !bidInfo.amount) {
      showMessage("error", "Please enter both item key and bid amount")
      return
    }

    setLoading({ ...loading, bid: true })
    try {
      const result = await auctionActor.bid_item(BigInt(bidInfo.key), Number.parseFloat(bidInfo.amount))
      showMessage("success", "Bid placed: " + JSON.stringify(result))
      setBidInfo({ key: "", amount: "" })
    } catch (error) {
      showMessage("error", "Failed to place bid: " + error.message)
    }
    setLoading({ ...loading, bid: false })
  }

  // End item
  const handleEnd = async () => {
    if (!endKey) {
      showMessage("error", "Please enter item key")
      return
    }

    setLoading({ ...loading, end: true })
    try {
      const result = await auctionActor.end_item(BigInt(endKey))
      showMessage("success", "Auction ended: " + JSON.stringify(result))
      setEndKey("")
    } catch (error) {
      showMessage("error", "Failed to end auction: " + error.message)
    }
    setLoading({ ...loading, end: false })
  }

  // Get item - Fixed version
  const handleGetItem = async () => {
    if (!getKey.trim()) {
      showMessage("error", "Please enter item key")
      return
    }

    // Clear previous search result
    setFetchedItem(undefined)
    setLoading({ ...loading, get: true })

    try {
      console.log("Searching for item with key:", getKey)
      const item = await auctionActor.get_item(BigInt(getKey.trim()))
      console.log("Search result:", item)

      if (item && item.length > 0) {
        // Handle optional response - item might be wrapped in an array
        setFetchedItem(item[0])
        showMessage("success", "Item found!")
      } else if (item) {
        // Direct item response
        setFetchedItem(item)
        showMessage("success", "Item found!")
      } else {
        // No item found
        setFetchedItem(null)
        showMessage("error", "Item not found")
      }
    } catch (error) {
      console.error("Search error:", error)
      setFetchedItem(null)
      showMessage("error", "Failed to search item: " + error.message)
    }

    setLoading({ ...loading, get: false })
  }

  // List items - Updated to show IDs
  const handleListItems = async () => {
    setLoading({ ...loading, list: true })
    try {
      const allItems = await auctionActor.list_items()
      console.log("All items response:", allItems)

      // Handle different response formats
      let processedItems = []
      if (Array.isArray(allItems)) {
        processedItems = allItems.map((item, index) => {
          // If item is a tuple [key, value] or has key property
          if (Array.isArray(item) && item.length === 2) {
            return {
              id: item[0].toString(),
              ...item[1],
            }
          } else if (item.key !== undefined) {
            return {
              id: item.key.toString(),
              ...item,
            }
          } else {
            // Fallback: use index as ID
            return {
              id: index.toString(),
              ...item,
            }
          }
        })
      }

      setItems(processedItems)
      showMessage("success", `Found ${processedItems.length} items`)
    } catch (error) {
      console.error("List items error:", error)
      showMessage("error", "Failed to list items: " + error.message)
    }
    setLoading({ ...loading, list: false })
  }

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>🔨 Auction DApp</h1>
          <p style={styles.subtitle}>Decentralized auction platform on Internet Computer</p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            style={{
              ...styles.alert,
              ...(message.type === "error" ? styles.alertError : styles.alertSuccess),
            }}
          >
            {message.type === "error" ? "⚠️" : "✅"} {message.text}
          </div>
        )}

        <div style={styles.grid}>
          {/* Create Item */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>➕ Create New Item</h2>
              <p style={styles.cardDescription}>Add a new item to the auction</p>
            </div>
            <div style={styles.cardContent}>
              <div style={styles.gridTwo}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Item Key *</label>
                  <input
                    style={styles.input}
                    placeholder="Enter unique key (e.g., 1, 2, 3)"
                    value={newItem.key}
                    onChange={(e) => setNewItem({ ...newItem, key: e.target.value })}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Name *</label>
                  <input
                    style={styles.input}
                    placeholder="Item name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <input
                  style={styles.input}
                  placeholder="Item description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Starting Price *</label>
                <input
                  style={styles.input}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newItem.starting_price}
                  onChange={(e) => setNewItem({ ...newItem, starting_price: e.target.value })}
                />
              </div>
              <button
                style={{
                  ...styles.button,
                  ...(loading.create ? styles.buttonDisabled : {}),
                }}
                onClick={handleCreate}
                disabled={loading.create}
              >
                {loading.create ? "Creating..." : "Create Item"}
              </button>
            </div>
          </div>

          {/* Bid on Item */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>💰 Place Bid</h2>
              <p style={styles.cardDescription}>Bid on an existing auction item</p>
            </div>
            <div style={styles.cardContent}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Item Key</label>
                <input
                  style={styles.input}
                  placeholder="Enter item key"
                  value={bidInfo.key}
                  onChange={(e) => setBidInfo({ ...bidInfo, key: e.target.value })}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Bid Amount</label>
                <input
                  style={styles.input}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={bidInfo.amount}
                  onChange={(e) => setBidInfo({ ...bidInfo, amount: e.target.value })}
                />
              </div>
              <button
                style={{
                  ...styles.button,
                  ...styles.buttonGreen,
                  ...(loading.bid ? styles.buttonDisabled : {}),
                }}
                onClick={handleBid}
                disabled={loading.bid}
              >
                {loading.bid ? "Placing Bid..." : "Place Bid"}
              </button>
            </div>
          </div>

          {/* End Auction */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>🛑 End Auction</h2>
              <p style={styles.cardDescription}>End an active auction</p>
            </div>
            <div style={styles.cardContent}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Item Key</label>
                <input
                  style={styles.input}
                  placeholder="Enter item key"
                  value={endKey}
                  onChange={(e) => setEndKey(e.target.value)}
                />
              </div>
              <button
                style={{
                  ...styles.button,
                  ...styles.buttonRed,
                  ...(loading.end ? styles.buttonDisabled : {}),
                }}
                onClick={handleEnd}
                disabled={loading.end}
              >
                {loading.end ? "Ending..." : "End Auction"}
              </button>
            </div>
          </div>

          {/* Get Specific Item - Fixed */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>🔍 Search Item</h2>
              <p style={styles.cardDescription}>Find a specific auction item by ID</p>
            </div>
            <div style={styles.cardContent}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Item Key</label>
                <input
                  style={styles.input}
                  placeholder="Enter item key (e.g., 1, 2, 3)"
                  value={getKey}
                  onChange={(e) => setGetKey(e.target.value)}
                />
              </div>
              <button
                style={{
                  ...styles.button,
                  ...styles.buttonPurple,
                  ...(loading.get ? styles.buttonDisabled : {}),
                }}
                onClick={handleGetItem}
                disabled={loading.get}
              >
                {loading.get ? "Searching..." : "Search Item"}
              </button>

              {fetchedItem === null && (
                <div style={{ ...styles.alert, ...styles.alertError, marginTop: "16px" }}>
                  ❌ Item not found. Make sure the item key exists.
                </div>
              )}

              {fetchedItem && fetchedItem.name && (
                <div style={styles.searchResult}>
                  <div style={styles.itemId}>ID: {getKey}</div>
                  <h4 style={styles.itemTitle}>{fetchedItem.name}</h4>
                  <p style={styles.itemDescription}>{fetchedItem.description}</p>
                  <div style={styles.gridTwo}>
                    <div>
                      <strong>Starting Price:</strong> ${fetchedItem.starting_price}
                    </div>
                    <div>
                      <strong>Highest Bid:</strong> ${fetchedItem.highest_bid || fetchedItem.starting_price}
                    </div>
                  </div>
                  <div style={{ marginTop: "8px" }}>
                    <span
                      style={{
                        ...styles.badge,
                        ...(fetchedItem.is_active ? styles.badgeActive : styles.badgeInactive),
                      }}
                    >
                      {fetchedItem.is_active ? "Active" : "Ended"}
                    </span>
                  </div>
                  {fetchedItem.highest_bidder && (
                    <div style={{ marginTop: "8px", fontSize: "0.9rem" }}>
                      <strong>Highest Bidder:</strong> {fetchedItem.highest_bidder.toString()}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* List All Items - Updated to show IDs */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>📋 All Auction Items</h2>
            <p style={styles.cardDescription}>View all items in the auction with their IDs</p>
          </div>
          <div style={styles.cardContent}>
            <button
              style={{
                ...styles.button,
                ...styles.buttonIndigo,
                ...(loading.list ? styles.buttonDisabled : {}),
                marginBottom: "16px",
              }}
              onClick={handleListItems}
              disabled={loading.list}
            >
              {loading.list ? "Loading..." : "Refresh Items"}
            </button>

            {items.length > 0 && (
              <div>
                {items.map((item, index) => (
                  <div key={index} style={styles.itemCard}>
                    <div style={styles.itemId}>ID: {item.id}</div>
                    <div style={styles.itemHeader}>
                      <h4 style={styles.itemTitle}>{item.name}</h4>
                      <span
                        style={{
                          ...styles.badge,
                          ...(item.is_active ? styles.badgeActive : styles.badgeInactive),
                        }}
                      >
                        {item.is_active ? "Active" : "Ended"}
                      </span>
                    </div>
                    <p style={styles.itemDescription}>{item.description}</p>
                    <div style={styles.itemFooter}>
                      <span>
                        <strong>Starting:</strong> ${item.starting_price}
                      </span>
                      <span>
                        <strong>Current Bid:</strong> ${item.highest_bid || item.starting_price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {items.length === 0 && (
              <div style={styles.emptyState}>
                <div style={{ fontSize: "3rem", marginBottom: "16px" }}>📋</div>
                <p>No items found. Click "Refresh Items" to load auction items.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
