import { DecisionTreeClassifier } from "ml-cart";

// Definisikan interface untuk data pelatihan
interface TrainingDataItem {
  color: "green" | "red" | "yellow";
  shape: "round" | "long";
  size: "small" | "medium" | "large";
  label: "apple" | "banana" | "cucumber";
}

// Dataset contoh
const trainingData: TrainingDataItem[] = [
  { color: "green", shape: "round", size: "small", label: "apple" },
  { color: "red", shape: "round", size: "medium", label: "apple" },
  { color: "yellow", shape: "long", size: "large", label: "banana" },
  { color: "green", shape: "long", size: "large", label: "cucumber" },
];

// Encode fitur non-numerik menjadi numerik
const encodeCategoricalFeatures = (data: TrainingDataItem[]): number[][] => {
  // Mappings untuk fitur-fitur kategorikal
  const colorMap: Record<TrainingDataItem["color"], number> = {
    green: 0,
    red: 1,
    yellow: 2,
  };
  const shapeMap: Record<TrainingDataItem["shape"], number> = {
    round: 0,
    long: 1,
  };
  const sizeMap: Record<TrainingDataItem["size"], number> = {
    small: 0,
    medium: 1,
    large: 2,
  };

  // Mengubah data fitur menjadi format numerik berdasarkan mapping
  return data.map((item) => [
    colorMap[item.color], // Encode warna menjadi angka
    shapeMap[item.shape], // Encode bentuk menjadi angka
    sizeMap[item.size], // Encode ukuran menjadi angka
  ]);
};

// Encode label menjadi numerik
const encodeLabels = (labels: TrainingDataItem["label"][]): number[] => {
  // Mapping label ke angka
  const labelMap: Record<TrainingDataItem["label"], number> = {
    apple: 0,
    banana: 1,
    cucumber: 2,
  };
  // Mengubah label menjadi format numerik berdasarkan mapping
  return labels.map((label) => labelMap[label]);
};

// Mengubah data menjadi format numerik
const encodedData = encodeCategoricalFeatures(trainingData);
const encodedLabels = encodeLabels(trainingData.map((item) => item.label));

// Membuat dan melatih model Decision Tree
const classifier = new DecisionTreeClassifier();
classifier.train(encodedData, encodedLabels);

// Definisikan interface untuk data yang akan diklasifikasikan
interface TestData {
  color: "green" | "red" | "yellow";
  shape: "round" | "long";
  size: "small" | "medium" | "large";
}

// Fungsi untuk mengklasifikasikan data baru
export function classify(data: TestData): string {
  // Mappings untuk fitur baru
  const colorMap: Record<TestData["color"], number> = {
    green: 0,
    red: 1,
    yellow: 2,
  };
  const shapeMap: Record<TestData["shape"], number> = { round: 0, long: 1 };
  const sizeMap: Record<TestData["size"], number> = {
    small: 0,
    medium: 1,
    large: 2,
  };

  // Encode fitur data baru menjadi format numerik
  const encodedTestData: number[] = [
    colorMap[data.color], // Encode warna data baru
    shapeMap[data.shape], // Encode bentuk data baru
    sizeMap[data.size], // Encode ukuran data baru
  ];

  // Prediksi hasil berdasarkan data yang telah diencode
  const result: number = classifier.predict([encodedTestData])[0];

  // Mapping angka ke label yang sesuai
  const labelMap: Record<number, string> = {
    0: "apple",
    1: "banana",
    2: "cucumber",
  };
  // Kembalikan label hasil prediksi
  return labelMap[result];
}
