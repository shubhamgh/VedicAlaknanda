import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useMenuAdmin, type MenuItem } from "@/hooks/useMenu";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function RestaurantMenuTab() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useMenuAdmin();
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newItem, setNewItem] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    is_available: true,
    is_veg: true,
  });

  const categories = data?.categories ?? [];
  const items = data?.items ?? [];

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      category_id: categories[0]?.id ?? "",
      is_available: true,
      is_veg: true,
    });
    setEditingItem(null);
    setNewItem(false);
  };

  const handleSave = async () => {
    const price = parseFloat(form.price);
    if (!form.name || isNaN(price) || !form.category_id) {
      toast({ title: "Invalid data", variant: "destructive" });
      return;
    }
    if (editingItem) {
      const { error } = await supabase
        .from("menu_items")
        .update({
          name: form.name,
          description: form.description || null,
          price,
          category_id: form.category_id,
          is_available: form.is_available,
          is_veg: form.is_veg,
        })
        .eq("id", editingItem.id);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Item updated" });
    } else {
      const { error } = await supabase.from("menu_items").insert({
        name: form.name,
        description: form.description || null,
        price,
        category_id: form.category_id,
        is_available: form.is_available,
        is_veg: form.is_veg,
      });
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Item added" });
    }
    resetForm();
    queryClient.invalidateQueries({ queryKey: ["menu-admin"] });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Item deleted" });
    queryClient.invalidateQueries({ queryKey: ["menu-admin"] });
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Menu Items</h2>
        <Button
          onClick={() => {
            setNewItem(true);
            setForm({
              name: "",
              description: "",
              price: "",
              category_id: categories[0]?.id ?? "",
              is_available: true,
              is_veg: true,
            });
          }}
          disabled={categories.length === 0}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Item
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <div className="space-y-4">
          {categories.map((cat) => {
            const catItems = items.filter((i) => i.category_id === cat.id);
            return (
              <Card key={cat.id}>
                <CardHeader>
                  <CardTitle>{cat.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {catItems.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No items</p>
                  ) : (
                    <div className="space-y-2">
                      {catItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center p-3 border rounded"
                        >
                          <div>
                            <span className="font-medium">{item.name}</span>
                            {!item.is_available && (
                              <span className="ml-2 text-xs text-amber-600">
                                (Unavailable)
                              </span>
                            )}
                            <span className="ml-2 text-muted-foreground text-sm">
                              ₹{item.price}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingItem(item);
                                setForm({
                                  name: item.name,
                                  description: item.description ?? "",
                                  price: String(item.price),
                                  category_id: item.category_id,
                                  is_available: item.is_available,
                                  is_veg: item.is_veg,
                                });
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={!!editingItem || newItem} onOpenChange={(o) => !o && resetForm()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit Item" : "Add Item"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Item name"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Optional"
              />
            </div>
            <div>
              <Label>Price (₹)</Label>
              <Input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label>Category</Label>
              <select
                className="w-full border rounded px-3 py-2"
                value={form.category_id}
                onChange={(e) =>
                  setForm((p) => ({ ...p, category_id: e.target.value }))
                }
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.is_available}
                  onCheckedChange={(v) =>
                    setForm((p) => ({ ...p, is_available: v }))
                  }
                />
                <Label>Available</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.is_veg}
                  onCheckedChange={(v) =>
                    setForm((p) => ({ ...p, is_veg: v }))
                  }
                />
                <Label>Vegetarian</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
