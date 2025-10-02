import { TriangleAlert } from "lucide-react";
import { Button } from "./ui/button";

export default function ErrorComponent() {
  return (
    <div
      className="flex justify-center items-center"
      style={{ height: "100vh", width: "100%" }}
    >
      <div>
        <div className="flex justify-center">
          <TriangleAlert
            color="orange"
            className="w-20 h-20 mb-5 text-center"
          />
        </div>
        <p className="text-center font-bold text-red-500">
          Sorry, something went wrong!
        </p>
        <p className="text-center font-bold">
          <i>
            <code>Try again later!</code>
          </i>
        </p>
        <div className="flex justify-center">
          <Button onClick={() => window.location.reload()}>Home</Button>
        </div>
      </div>
    </div>
  );
}
