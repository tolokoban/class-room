/**
 * Fisher Linear Discriminant Analysis, used by the `generate.mts` scripts
 * (through `fitProjection()` in `generator.mts`) to find the 3 directions
 * that best separate the groups in the 3D view.
 *
 * Unlike a PCA, it uses the groups (for instance all the wordings of a question):
 * it looks for directions where the groups are far from each other,
 * while each group stays tight. With the questions of "Devine l'animal",
 * a PCA keeps only 13% of the variance in 3D and the groups are lost in the noise.
 *
 * The result is a linear projection, so any new sentence can be placed
 * in the same 3D space with 3 dot products (see `projection.ts`).
 */

type Matrix = Float64Array[];

export interface Lda {
  /** Mean of all the vectors, to subtract before projecting. */
  mean: number[];
  /** Unit vectors, from the most discriminant to the least. */
  axes: number[][];
}

/**
 * @param groups Each group is a list of vectors that belong together.
 * @param dimensions Number of axes to return.
 * @param shrinkage Regularization of the within-group scatter, as a fraction
 * of its average variance. Without it, with only a few hundred vectors in 384
 * dimensions, the LDA would overfit: it would find directions that separate
 * the training wordings perfectly, but where a new sentence lands randomly.
 */
export function fisherLda(groups: number[][][], dimensions: number, shrinkage = 0.5): Lda {
  const size = groups[0][0].length;
  const mean = average(groups.flat(), size);
  const centroids = groups.map((group) => average(group, size));
  // Within-group scatter.
  const within = zeros(size);
  groups.forEach((group, index) => {
    for (const vector of group) addOuter(within, difference(vector, centroids[index]));
  });
  const trace = within.reduce((sum, row, index) => sum + row[index], 0);
  for (let i = 0; i < size; i++) within[i][i] += (shrinkage * trace) / size;
  // Between-group scatter.
  const between = zeros(size);
  groups.forEach((group, index) =>
    addOuter(between, difference(centroids[index], mean), group.length),
  );
  // Whitening: in this basis, the within-group scatter becomes the identity,
  // so we just have to look for the directions of largest between-group scatter.
  const { values, vectors } = eigen(within);
  const whitening = vectors.map((vector, k) => vector.map((x) => x / Math.sqrt(values[k])));
  const whitened = multiply(multiply(whitening, between), transpose(whitening));
  const discriminant = eigen(whitened).vectors.slice(0, dimensions);
  const axes = discriminant.map((u) => {
    const axis = new Float64Array(size);
    u.forEach((weight, k) => {
      for (let i = 0; i < size; i++) axis[i] += weight * whitening[k][i];
    });
    const norm = Math.hypot(...axis);
    return Array.from(axis, (x) => x / norm);
  });
  return { mean: Array.from(mean), axes };
}

function zeros(size: number): Matrix {
  return Array.from({ length: size }, () => new Float64Array(size));
}

function average(vectors: ArrayLike<number>[], size: number): Float64Array {
  const result = new Float64Array(size);
  for (const vector of vectors) {
    for (let i = 0; i < size; i++) result[i] += vector[i] / vectors.length;
  }
  return result;
}

function difference(a: ArrayLike<number>, b: ArrayLike<number>): Float64Array {
  return Float64Array.from({ length: a.length }, (_, i) => a[i] - b[i]);
}

/** `matrix += weight * d * transpose(d)` */
function addOuter(matrix: Matrix, d: Float64Array, weight = 1) {
  for (let i = 0; i < d.length; i++) {
    const row = matrix[i];
    const factor = weight * d[i];
    for (let j = 0; j < d.length; j++) row[j] += factor * d[j];
  }
}

function transpose(matrix: Matrix): Matrix {
  return Array.from(matrix[0], (_, j) => Float64Array.from(matrix, (row) => row[j]));
}

function multiply(a: Matrix, b: Matrix): Matrix {
  return a.map((row) => {
    const result = new Float64Array(b[0].length);
    row.forEach((x, k) => {
      const other = b[k];
      for (let j = 0; j < result.length; j++) result[j] += x * other[j];
    });
    return result;
  });
}

/**
 * Eigen decomposition of a symmetric matrix, with the cyclic Jacobi method.
 * Slow (a few seconds for 384×384) but simple and very stable.
 * `matrix` is modified.
 * @returns Eigen values and vectors, sorted by decreasing eigen value.
 */
function eigen(matrix: Matrix): { values: number[]; vectors: Float64Array[] } {
  const n = matrix.length;
  const a = matrix;
  const v = zeros(n);
  for (let i = 0; i < n; i++) v[i][i] = 1;
  for (let sweep = 0; sweep < 50; sweep++) {
    let offDiagonal = 0;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) offDiagonal += a[p][q] ** 2;
    if (offDiagonal < 1e-22) break;

    for (let p = 0; p < n; p++) {
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(a[p][q]) < 1e-15) continue;

        const theta = (a[q][q] - a[p][p]) / (2 * a[p][q]);
        const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        rotateColumns(a, p, q, c, s);
        rotateRows(a, p, q, c, s);
        rotateColumns(v, p, q, c, s);
      }
    }
  }
  const order = [...Array(n).keys()].sort((i, j) => a[j][j] - a[i][i]);
  return {
    values: order.map((i) => a[i][i]),
    vectors: order.map((i) => Float64Array.from(v, (row) => row[i])),
  };
}

function rotateColumns(m: Matrix, p: number, q: number, c: number, s: number) {
  for (const row of m) {
    const x = row[p];
    const y = row[q];
    row[p] = c * x - s * y;
    row[q] = s * x + c * y;
  }
}

function rotateRows(m: Matrix, p: number, q: number, c: number, s: number) {
  const rowP = m[p];
  const rowQ = m[q];
  for (let k = 0; k < rowP.length; k++) {
    const x = rowP[k];
    const y = rowQ[k];
    rowP[k] = c * x - s * y;
    rowQ[k] = s * x + c * y;
  }
}
