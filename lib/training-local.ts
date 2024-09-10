// training.ts

import { TreeNode, buildTree } from "./decision-tree";

// Mappings untuk enkoding fitur
const colorMap: Record<string, number> = {
  green: 0,
  red: 1,
  yellow: 2,
};
const shapeMap: Record<string, number> = { round: 0, long: 1 };
const sizeMap: Record<string, number> = {
  small: 0,
  medium: 1,
  large: 2,
};

// Pemetaan label string ke numerik
const labelMap: Record<string, number> = {
  apple: 0,
  banana: 1,
  cucumber: 2,
};

// Pemetaan label numerik ke string
const inverseLabelMap: Record<number, string> = {
  0: "apple",
  1: "banana",
  2: "cucumber",
};

// Fungsi untuk mengonversi fitur kategorikal menjadi numerik
const encodeCategoricalFeatures = (
  data: { color: string; shape: string; size: string }[]
): number[][] => {
  return data.map((item) => [
    colorMap[item.color], // Encode warna menjadi angka
    shapeMap[item.shape], // Encode bentuk menjadi angka
    sizeMap[item.size], // Encode ukuran menjadi angka
  ]);
};

// Fungsi untuk mengonversi data pelatihan menjadi format numerik
const encodeDataWithLabels = (
  data: { color: string; shape: string; size: string; label: string }[]
): [number[][], number[]] => {
  const encodedData = encodeCategoricalFeatures(
    data.map(({ color, shape, size }) => ({ color, shape, size }))
  );
  const labels = data.map(({ label }) => labelMap[label]);
  return [encodedData, labels];
};

// Data pelatihan contoh dengan label
const trainingData = [
  { color: "green", shape: "round", size: "small", label: "apple" },
  { color: "red", shape: "round", size: "medium", label: "apple" },
  { color: "yellow", shape: "long", size: "large", label: "banana" },
  { color: "green", shape: "long", size: "large", label: "cucumber" },
];

// Encode data dan label
const [encodedData, encodedLabels] = encodeDataWithLabels(trainingData);
const featureIndices = [0, 1, 2]; // Indeks fitur
const decisionTree = buildTree(encodedData, encodedLabels, featureIndices);

// Fungsi untuk melakukan prediksi
export const classify = (data: {
  color: string;
  shape: string;
  size: string;
}): string => {
  const encodedTestData = encodeCategoricalFeatures([data])[0];
  const result = predict(encodedTestData);
  return inverseLabelMap[result];
};

// Fungsi untuk klasifikasi
export const predict = (data: number[]): number => {
  const predictRecursive = (tree: TreeNode, data: number[]): number => {
    if (tree.label) {
      return parseInt(tree.label) as number;
    }

    const number = data[0]; // Asumsi satu fitur untuk kesederhanaan
    const childNode = tree.children![number];

    if (!childNode) {
      throw new Error(`Tidak ada node anak untuk nilai fitur: ${number}`);
    }

    return predictRecursive(childNode, data.slice(1)); // Menggunakan data yang tersisa
  };

  return predictRecursive(decisionTree, data);
};
