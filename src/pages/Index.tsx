import { useGetProductsQuery } from "@/api/apiSlice";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/contexts/ProductContext";
import { useState } from "react";

const Index = () => {
  const { products } = useProducts();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data, isSuccess, isError, isLoading } = useGetProductsQuery({
    page,
    limit,
  });

  if (isError) {
    return (
      <div>
        <p className="mb-0">Error...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <p className="mb-0">Loading...</p>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navbar />

        <main className="container mx-auto px-4 py-8">
          <div className="mb-12 text-center">
            <h1 className="mb-4 bg-gradient-primary bg-clip-text text-5xl font-bold text-transparent">
              Discover Amazing Products
            </h1>
            <p className="text-lg text-muted-foreground">
              Quality products at unbeatable prices
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.map((product) => {
              product.isDeleted == false && (
                <ProductCard key={product.id} product={product} />
              );
            })}
          </div>
        </main>
      </div>
    );
  }
};

export default Index;
