import { Circles } from "react-loader-spinner";

export default function Loading() {
  return (
    <div
      className="flex justify-center items-center"
      style={{ height: "100vh", width: "100%" }}
    >
      <Circles color="orange" />
    </div>
  );
}
