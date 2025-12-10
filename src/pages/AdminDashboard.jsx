// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import toast, { Toaster } from "react-hot-toast";
import { Pencil, Trash2, Plus, X } from "lucide-react";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const perPage = 5;

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
  });
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { token } = useAuth();
  const api = axios.create({
    baseURL: "http://localhost:5000",
    headers: { Authorization: `Bearer ${token}` },
  });

  // fetch
  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/api/products");
      setProducts(data);
      setFiltered(data);
    } catch (e) {
      toast.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // search
  useEffect(() => {
    const res = products.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(res);
    setPage(0);
  }, [search, products]);

  // pagination
  const pageCount = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice(page * perPage, (page + 1) * perPage);

  // create / update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/api/products/${editId}`, form);
        toast.success("Updated successfully");
      } else {
        await api.post("/api/products", form);
        toast.success("Added successfully");
      }
      setShowModal(false);
      resetForm();
      fetchProducts();
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  // delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/api/products/${id}`);
      toast.success("Deleted");
      fetchProducts();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // helpers
  const resetForm = () => {
    setForm({ name: "", price: "", category: "", image: "" });
    setEditId(null);
  };

  const openEdit = (p) => {
    setForm({ name: p.name, price: p.price, category: p.category, image: p.image || "" });
    setEditId(p._id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  // image preview
  const previewSrc = form.image || "https://picsum.photos/400/300?grayscale";

  return (
    <div className="py-8 max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name/category"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md border px-4 py-2 rounded"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Category</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((p) => (
              <tr key={p._id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <img
                    src={p.image || "https://picsum.photos/60/60"}
                    alt={p.name}
                    className="w-14 h-14 object-cover rounded"
                  />
                </td>
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3">${Number(p.price).toFixed(2)}</td>
                <td className="p-3">{p.category}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => openEdit(p)}
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Pencil size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="text-red-600 hover:underline flex items-center gap-1"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {[...Array(pageCount)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`px-3 py-1 rounded ${i === page ? "bg-black text-white" : "bg-gray-200 hover:bg-gray-300"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-4">
              {editId ? "Edit Product" : "Add New Product"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Product Name"
                required
                className="w-full border px-4 py-2 rounded"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                type="number"
                placeholder="Price"
                required
                className="w-full border px-4 py-2 rounded"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
              <input
                type="text"
                placeholder="Category"
                required
                className="w-full border px-4 py-2 rounded"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
              <input
                type="text"
                placeholder="Image URL"
                className="w-full border px-4 py-2 rounded"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
              {/* Image Preview */}
              <div className="flex justify-center">
                <img
                  src={previewSrc}
                  alt="preview"
                  className="h-32 object-cover rounded border"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                  {editId ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;