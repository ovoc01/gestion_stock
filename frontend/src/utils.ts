export const levenshteinDistance = (a:string, b:string) => {
   const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]).concat(
      Array.from({ length: a.length }, (_) =>
         Array.from({ length: b.length + 1 }, (_, j) => j && 0)
      )
   );

   for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
         matrix[i][j] =
            a[i - 1] === b[j - 1]
               ? matrix[i - 1][j - 1]
               : Math.min(matrix[i - 1][j - 1], matrix[i][j - 1], matrix[i - 1][j]) + 1;
      }
   }

   return matrix[a.length][b.length];
};
