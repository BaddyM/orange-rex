import { useState } from "react";
import { useProducts } from "@/contexts/ProductContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2, Plus, Repeat } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  baseUrl,
  useAddProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
} from "@/api/apiSlice";
import { current } from "@reduxjs/toolkit";
import { Product } from "@/types/product";

const ProductManagement = () => {
  const { products } = useProducts();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteProduct] = useDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [addProduct] = useAddProductMutation();
  const [formData, setFormData] = useState<Product>({
    name: "",
    description: "",
    price: 0,
    image: "",
    category: "",
    inStock: 0,
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data, isSuccess, isError, isLoading } = useGetProductsQuery({
    page,
    limit,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      image: "",
      category: "",
      inStock: 0,
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData();
    form.append("name", formData.name);
    form.append("category", formData.category);
    form.append("description", formData.description);
    form.append("image", formData.image);
    form.append("price", formData.price.toString());
    form.append("inStock", formData.inStock.toString());

    if (editingId) {
      //   updateProduct(editingId, productData);
      toast({
        title: "Product updated",
        description: "The product has been updated successfully",
      });
    } else {
      const res = await addProduct(form);
      setLoading(false);
      if (res.error) {
        toast({
          title: "Error",
          description: "Sorry, failed to add new product",
          variant: "destructive",
        });
      } else {
        resetForm();
        toast({
          title: "Product added",
          description: "New product has been added successfully",
        });
      }
    }
  };

  const handleEdit = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category,
        inStock: product.inStock,
      });
      setEditingId(productId);
      setIsAdding(true);
    }
  };

  const handleDelete = async (productId: string) => {
    const res = await deleteProduct(productId);
    if (res.error) {
      toast({
        title: "Error",
        description: "Sorry, failed to delete product",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Product deleted",
        description: "The product has been removed",
      });
    }
  };

  return (
    <div className="space-y-6">
      {!isAdding && (
        <Button onClick={() => setIsAdding(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Product
        </Button>
      )}

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId ? "Edit Product" : "Add New Product"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
              encType="multipart/form-data"
            >
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="price">Price (UGX)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    required
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    required
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  accept="image/*"
                  type="file"
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.files[0] })
                  }
                />
              </div>

              <div className="flex items-center space-x-2">
                <Label htmlFor="inStock">In Stock</Label>
                <Input
                  id="inStock"
                  type="number"
                  required
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      inStock: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div className="flex gap-2">
                <Button disabled={loading} type="submit">
                  {editingId ? "Update Product" : "Add Product"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isSuccess && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((product) => (
            <Card key={product.id}>
              <div className="aspect-square overflow-hidden">
                <img
                  src={`${baseUrl}/${product.image}`}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
                  {product.description}
                </p>
                <p className="mb-1 text-xl font-bold text-primary">
                  {Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "UGX",
                  }).format(product.price)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {product.category}
                </p>
                <p className="mt-2 text-sm">
                  Status:{" "}
                  <span
                    className={
                      product.inStock > 0 ? "text-green-600" : "text-red-600"
                    }
                  >
                    {product.inStock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </p>
              </CardContent>
              <CardFooter className="gap-2">
                {/* <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEdit(product.id)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button> */}
                {product.isDeleted == false && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                )}
                {product.isDeleted == true && (
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      updateProduct({
                        id: product.id,
                        data: { isDeleted: false },
                      }).then((res) => {
                        if (res.error) {
                          toast({
                            title: "Error",
                            description: "Sorry, failed to recover product",
                            variant: "destructive",
                          });
                        } else {
                          toast({
                            title: "Product deleted",
                            description: "The product has been recovered",
                          });
                        }
                      });
                    }}
                  >
                    <Repeat className="mr-2 h-4 w-4" />
                    Recover
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
