import { useGetProductsQuery } from "@/api/apiSlice";
import ErrorComponent from "@/components/Error";
import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/contexts/ProductContext";
import { useState } from "react";

const Index = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data, isSuccess, isError, isLoading } = useGetProductsQuery({
    page,
    limit,
  });

  if (isError) {
    return (
      <ErrorComponent/>
    );
  }

  if (isLoading) {
    return (
      <Loading/>
    );
  }

  if (isSuccess) {
    const filteredProducts: any[] = data.filter(
      (item) => item.isDeleted == false
    );
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

          {/* {filteredProducts.length} */}
          {filteredProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map(
                (product) =>
                  product.isDeleted == false && (
                    <ProductCard key={product.id} product={product} />
                  )
              )}
            </div>
          ) : (
            <div
              className="flex justify-center items-center w-full"
              style={{ height: "50vh" }}
            >
              <div>
                <img
                  src="/no-data.jpg"
                  style={{ width: "200px", height: "200px" }}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }
};

export default Index;
