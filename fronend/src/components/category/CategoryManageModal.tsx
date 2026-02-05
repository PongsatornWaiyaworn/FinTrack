"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Category } from "@/types/category";
import { apiFetch } from "@/lib/api";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CategoryManageModal({ open, onClose }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [originalCategories, setOriginalCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#6366f1");
  const [saving, setSaving] = useState(false);

  async function loadCategories() {
    const data = await apiFetch("/categories");
    setCategories(data);
    setOriginalCategories(data);
  }

  useEffect(() => {
    if (open) {
      loadCategories();
      setName("");
      setColor("#6366f1");
    }
  }, [open]);

  function addCategoryLocal() {
    if (!name.trim()) return;

    setCategories((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(), // temp id
        name,
        color,
        user_id: "temp",
        created_at: new Date().toISOString(),
      },
    ]);

    setName("");
    setColor("#6366f1");
  }

  function removeCategoryLocal(id: string) {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  async function saveChanges() {
    setSaving(true);

    try {
      const originalMap = new Map(
        originalCategories.map((c) => [c.id, c])
      );
      const currentMap = new Map(categories.map((c) => [c.id, c]));

      const create: any[] = [];
      const update: any[] = [];
      const del: string[] = [];

      // create + update
      for (const cat of categories) {
        if (!originalMap.has(cat.id)) {
          create.push({
            name: cat.name,
            color: cat.color ?? null,
          });
        } else {
          const orig = originalMap.get(cat.id)!;
          if (orig.name !== cat.name || orig.color !== cat.color) {
            update.push({
              id: cat.id,
              name: cat.name,
              color: cat.color ?? null,
            });
          }
        }
      }

      // delete
      for (const orig of originalCategories) {
        if (!currentMap.has(orig.id)) {
          del.push(orig.id);
        }
      }

      if (create.length || update.length || del.length) {
        await apiFetch("/categories/bulk", {
          method: "PUT",
          body: JSON.stringify({
            create,
            update,
            delete: del,
          }),
        });
      }

      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="
          w-[95vw]
          max-w-md
          max-h-[90vh]
          flex flex-col
        "
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Header */}
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
        </DialogHeader>

        {/* Category List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="
                flex items-center justify-between
                rounded-xl border
                px-3 py-2
                gap-3
              "
            >
              <div className="flex items-center gap-3 min-w-0">
                <input
                  type="color"
                  value={cat.color ?? "#94a3b8"}
                  onChange={(e) =>
                    setCategories((prev) =>
                      prev.map((c) =>
                        c.id === cat.id
                          ? { ...c, color: e.target.value }
                          : c
                      )
                    )
                  }
                  className="w-8 h-8 rounded-md border cursor-pointer shrink-0"
                  aria-label="Category color"
                />

                <span className="truncate text-sm font-medium">
                  {cat.name}
                </span>
              </div>

              <Button
                size="icon"
                variant="ghost"
                onClick={() => removeCategoryLocal(cat.id)}
                aria-label="Delete category"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}

          {categories.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">
              No categories
            </p>
          )}
        </div>

        {/* Add Category */}
        <div className="mt-4 rounded-xl border p-3 space-y-3">
          <p className="text-sm font-medium">Add new category</p>

          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1"
            />

            <div className="flex gap-2">
              <Input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-14 h-10 p-1"
              />

              <Button
                onClick={addCategoryLocal}
                className="flex-1 sm:flex-none"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="mt-4 gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>

          <Button
            onClick={saveChanges}
            disabled={saving}
            className="w-full sm:w-auto"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
