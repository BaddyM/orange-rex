import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useAddPaymentMutation, useAddSalesMutation } from "@/api/apiSlice";

export interface Sales {
  productId: string;
  name: string;
  email?: string;
  phone: string;
  qty: number;
  address: string;
}

export interface Payment {
  salesId: string;
  status?: string;
  amount: number;
}

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const [loading, isLoading] = useState(false);
  const navigate = useNavigate();
  const [addSales] = useAddSalesMutation();
  const [addPayment] = useAddPaymentMutation();
  const [formData, setFormData] = useState<Sales>({
    name: "",
    email: "",
    address: "",
    phone: "",
    productId: "",
    qty: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    isLoading(true);
    const sales: Sales[] = [];
    cart.map((item: any) => {
      sales.push({ ...formData, productId: item.id, qty: item.quantity });
    });

    const res = await addSales(sales);
    if (res.error) {
      isLoading(false);
      toast({
        title: "Error!",
        description: "Sorry, failed to place Order.",
        variant: "destructive",
      });
    } else {
      //Make payment
      const payRes = await addPayment({
        salesId: res.data.salesId,
        amount: getCartTotal(),
      });

      isLoading(false);

      toast({
        title: "Order placed successfully!",
        description:
          "Thank you for your purchase. You will receive a payment request shortly.",
      });

      if (payRes.error) {
        toast({
          title: "Error!",
          description: "Sorry, failed to create payment.",
          variant: "destructive",
        });
      } else {
        console.log(payRes.data);
        const url: string = payRes.data.paymentInfo.redirect_url;
        window.location.replace(url);
      }

      // clearCart();
      // navigate("/");
    }
  };

  if (cart.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      required
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="cardNumber">Contact</Label>
                    <Input
                      id="cardNumber"
                      placeholder="078XXXXXXX"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>

                  <Button
                    disabled={loading}
                    type="submit"
                    size="lg"
                    className="w-full"
                  >
                    Complete Order -{" "}
                    {Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "UGX",
                    }).format(getCartTotal())}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span className="font-medium">
                        {Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "UGX",
                        }).format(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-primary">
                        {Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "UGX",
                        }).format(getCartTotal())}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
