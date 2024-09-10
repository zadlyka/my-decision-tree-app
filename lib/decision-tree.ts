export interface TreeNode {
  feature?: string;
  value?: number;
  label?: string;
  children?: Record<number, TreeNode>;
}

// Fungsi untuk menghitung entropi
export const entropy = (labels: number[]): number => {
  const labelCounts = labels.reduce<Record<number, number>>((acc, label) => {
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});

  const total = labels.length;
  return Object.values(labelCounts).reduce((acc, count) => {
    const probability = count / total;
    return acc - probability * Math.log2(probability);
  }, 0);
};

// Fungsi untuk menghitung information gain
export const informationGain = (
  data: number[][],
  labels: number[],
  featureIndex: number
): number => {
  const featureValues = Array.from(
    new Set(data.map((row) => row[featureIndex]))
  );
  const totalEntropy = entropy(labels);

  const weightedEntropy = featureValues.reduce((acc, value) => {
    const subset = data.filter((row) => row[featureIndex] === value);
    const subsetLabels = subset.map((row) => labels[data.indexOf(row)]);
    return acc + (subset.length / labels.length) * entropy(subsetLabels);
  }, 0);

  return totalEntropy - weightedEntropy;
};

// Fungsi untuk membangun pohon keputusan
export const buildTree = (
  data: number[][],
  labels: number[],
  featureIndices: number[]
): TreeNode => {
  const uniqueLabels = Array.from(new Set(labels));

  // Kasus dasar: jika semua label sama
  if (uniqueLabels.length === 1) {
    return { label: uniqueLabels[0].toString() };
  }

  // Kasus dasar: jika tidak ada fitur yang tersisa
  if (featureIndices.length === 0) {
    const majorityLabel = labels.reduce<Record<number, number>>(
      (acc, label) => {
        acc[label] = (acc[label] || 0) + 1;
        return acc;
      },
      {}
    );
    const mostCommonLabel = Object.keys(majorityLabel).reduce((a, b) =>
      majorityLabel[+a] > majorityLabel[+b] ? a : b
    );
    return { label: mostCommonLabel };
  }

  // Menentukan fitur terbaik untuk split
  const bestFeatureIndex = featureIndices.reduce(
    (best, featureIndex) => {
      const gain = informationGain(data, labels, featureIndex);
      return gain > best.gain ? { featureIndex, gain } : best;
    },
    { featureIndex: -1, gain: -Infinity }
  ).featureIndex;

  // Jika tidak ada fitur yang memberikan keuntungan, gunakan label mayoritas
  if (bestFeatureIndex === -1) {
    const majorityLabel = labels.reduce<Record<number, number>>(
      (acc, label) => {
        acc[label] = (acc[label] || 0) + 1;
        return acc;
      },
      {}
    );
    const mostCommonLabel = Object.keys(majorityLabel).reduce((a, b) =>
      majorityLabel[+a] > majorityLabel[+b] ? a : b
    );
    return { label: mostCommonLabel };
  }

  // Membangun pohon keputusan
  const tree: TreeNode = {
    feature: `feature${bestFeatureIndex}`,
    children: {},
  };

  const featureValues = Array.from(
    new Set(data.map((row) => row[bestFeatureIndex]))
  );

  featureValues.forEach((value) => {
    const subset = data.filter((row) => row[bestFeatureIndex] === value);
    const subsetLabels = subset.map((row) => labels[data.indexOf(row)]);
    const remainingFeatures = featureIndices.filter(
      (index) => index !== bestFeatureIndex
    );
    tree.children![value] = buildTree(subset, subsetLabels, remainingFeatures);
  });

  return tree;
};

// Fungsi untuk normalisasi data
export const normalizeData = (data: number[][]): number[][] => {
  // Menghitung min dan max untuk setiap fitur
  const minValues = data[0].map((_, i) =>
    Math.min(...data.map((row) => row[i]))
  );
  const maxValues = data[0].map((_, i) =>
    Math.max(...data.map((row) => row[i]))
  );

  // Normalisasi data
  return data.map((row) =>
    row.map(
      (value, i) => (value - minValues[i]) / (maxValues[i] - minValues[i])
    )
  );
};
