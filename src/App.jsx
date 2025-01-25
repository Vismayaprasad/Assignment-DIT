import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [editIndex, setEditIndex] = useState(null);

  const nameRef = useRef(null);

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("inventoryItems")) || [];
    setItems(storedItems);
  }, []);

  useEffect(() => {
    localStorage.setItem("inventoryItems", JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    if (!itemName || !quantity || !category) return;

    const newItem = {
      name: itemName,
      quantity: Number(quantity),
      category,
    };

    if (editIndex !== null) {
      items[editIndex] = newItem;
      setItems([...items]);
      setEditIndex(null);
    } else {
      setItems([...items, newItem]);
    }

    setItemName("");
    setQuantity("");
    setCategory("");
  };

  const deleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const editItem = (index) => {
    const item = items[index];
    setItemName(item.name);
    setQuantity(item.quantity);
    setCategory(item.category);
    setEditIndex(index);
    nameRef.current.focus();
  };

  const filteredItems = items.filter((item) =>
    filter === "all" ? true : item.category === filter
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "quantity") return a.quantity - b.quantity;
    return 0;
  });

  return (
    <div className="app">
      <div className="form">
        <input
          type="text"
          placeholder="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          ref={nameRef}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button onClick={addItem}>{editIndex !== null ? "Update" : "Add"}</button>
      </div>

      <div className="filters">
        <select onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Categories</option>
          {[...new Set(items.map((item) => item.category))].map((cat, i) => (
            <option value={cat} key={i}>
              {cat}
            </option>
          ))}
        </select>

        <select onChange={(e) => setSortBy(e.target.value)}>
          <option value="default">Default</option>
          <option value="quantity">Sort by Quantity</option>
        </select>
      </div>

      <table className="inventory-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedItems.map((item, index) => (
            <tr
              key={index}
              className={item.quantity < 10 ? "low-stock" : ""}
            >
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.category}</td>
              <td>
                <button onClick={() => editItem(index)}>Edit</button>
                <button onClick={() => deleteItem(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {items.length === 0 && <p>No items in inventory.</p>}
    </div>
  );
}

export default App;
