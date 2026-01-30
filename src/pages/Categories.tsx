import React, { useEffect, useState } from "react";
import { api } from "@/api/axios";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

interface Category {
  id: number;
  name: string;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  /* ===== Fetch Categories ===== */
  const fetchCategories = async () => {
    const res = await api
      .get("/categories")
      .then((res) => {
        const categoriesArray = Array.isArray(res.data)
          ? res.data
          : res.data.data;
        setCategories(categoriesArray || []);
      })
      .catch(() => setCategories([]));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ===== Add Category ===== */
  const handleAdd = async () => {
    if (!name.trim()) return alert("Category name is required");

    try {
      setLoading(true);
      const res = await api.post("/categories", { category_name: name });
      console.log("Added:", res.data); // 👈 عشان تشوف الـ response
      setName("");
      fetchCategories();
    } catch (err: any) {
      console.error(err.response?.data || err);
      alert("Error adding category: " + JSON.stringify(err.response?.data));
    } finally {
      setLoading(false);
    }
  };

  /* ===== Delete Category ===== */
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    await api.delete(`/categories/${id}`);
    fetchCategories();
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Categories</h1>

        {/* Add Form */}
        <Card>
          <CardHeader>
            <CardTitle>Add Category</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Input
              placeholder="Category name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button onClick={handleAdd} disabled={loading}>
              {loading ? "Adding..." : "Add"}
            </Button>
          </CardContent>
        </Card>

        {/* List */}
        <Card>
          <CardHeader>
            <CardTitle>All Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {categories.length === 0 ? (
              <p className="text-muted-foreground">No categories yet</p>
            ) : (
              categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <span>{cat.name}</span>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleDelete(cat.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
