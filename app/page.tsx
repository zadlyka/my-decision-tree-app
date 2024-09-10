import { classify } from "../lib/decisionTree";

// Definisikan interface untuk data yang akan diklasifikasikan
interface TestData {
  color: "green" | "red" | "yellow";
  shape: "round" | "long";
  size: "small" | "medium" | "large";
}

export default function Home() {
  // Data contoh untuk diklasifikasikan
  const testData: TestData = { color: "red", shape: "round", size: "medium" };

  // Klasifikasikan data
  const result = classify(testData);

  return (
    <div>
      <h1>Decision Tree Classification Result</h1>
      <p>Data: {JSON.stringify(testData)}</p>
      <p>Classification Result: {result}</p>
    </div>
  );
}
