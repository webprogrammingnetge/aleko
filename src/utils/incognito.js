// "use client";

// export const isIncognito = async () => {
//   if ('storage' in navigator && 'estimate' in navigator.storage) {
//     const { quota } = await navigator.storage.estimate();
//     if (quota && quota < 120 * 1024 * 1024) {
//       return true;
//     }
//   }

//   if (window.webkitRequestFileSystem) {
//     return new Promise((resolve) => {
//       window.webkitRequestFileSystem(
//         window.TEMPORARY,
//         100,
//         () => resolve(false),
//         () => resolve(true)
//       );
//     });
//   }

//   return false;
// };
"use client";

export const isIncognito = async () => {
  return new Promise((resolve) => {
    const fs = window.RequestFileSystem || window.webkitRequestFileSystem;

    if (!fs) {
      // ბრაუზერს არ აქვს FileSystem API → ვერ ვადგენთ
      resolve(false);
    } else {
      fs(window.TEMPORARY, 100, () => resolve(false), () => resolve(true));
    }
  });
};
