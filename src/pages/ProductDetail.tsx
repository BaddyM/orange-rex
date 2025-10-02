import { useParams, Link } from "react-router-dom";
import { useProducts } from "@/contexts/ProductContext";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { baseUrl, useGetProductsQuery } from "@/api/apiSlice";
import { useState } from "react";
import ErrorComponent from "@/components/Error";
import Loading from "@/components/Loading";

const ProductDetail = () => {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const {
    data: products,
    isSuccess,
    isError,
    isLoading,
  } = useGetProductsQuery({ page, limit });
  const { addToCart } = useCart();

  if (isError) {
    return <ErrorComponent />;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (isSuccess) {
    const product = products.find((p) => p.id === id);

    if (!product) {
      return (
        <div className="min-h-screen bg-gradient-subtle">
          <Navbar />
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="mb-4 text-2xl font-bold">Product not found</h1>
            <Link to="/">
              <Button>Back to Store</Button>
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navbar />

        <main className="container mx-auto px-4 py-8">
          <Link to="/">
            <Button variant="ghost" className="mb-6 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Store
            </Button>
          </Link>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="overflow-hidden rounded-xl shadow-card">
              <img
                src={`${baseUrl}/${product.image}`}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-col">
              <div className="mb-4 inline-block">
                <span className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
                  {product.category}
                </span>
              </div>

              <h1 className="mb-4 text-4xl font-bold">{product.name}</h1>

              <p className="mb-6 text-lg text-muted-foreground">
                {product.description}
              </p>

              <div className="mb-8">
                <span className="text-4xl font-bold text-primary">
                  {Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "UGX",
                  }).format(product.price)}
                </span>
              </div>

              <div className="mb-4">
                <span
                  className={`inline-block rounded-full px-4 py-2 text-sm font-medium ${
                    product.inStock
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              <Button
                size="lg"
                className="gap-2"
                onClick={() => addToCart(product)}
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-5 w-5" />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }
};

export default ProductDetail;
