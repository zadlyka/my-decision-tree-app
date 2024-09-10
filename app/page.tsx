import { classify as classifyLocal } from "@/lib/training-local";
import { classify as classifyLib } from "@/lib/training-ml-cart";

// Definisikan interface untuk data yang akan diklasifikasikan
interface TestData {
  color: "green" | "red" | "yellow";
  shape: "round" | "long";
  size: "small" | "medium" | "large";
}

export default function Home() {
  // Data contoh untuk diklasifikasikan
  const testData: TestData = { color: "yellow", shape: "long", size: "large" };

  // Klasifikasikan data
  const resultLocal = classifyLocal(testData);
  const resultLib = classifyLib(testData);

  return (
    <div>
      <h1>Decision Tree Classification Result</h1>
      <p>Data: {JSON.stringify(testData)}</p>
      <p>Classification Result (Local Algorithm): {resultLocal}</p>
      <p>Classification Result (ML Cart Library): {resultLib}</p>
    </div>
  );
}
