export const disableScrolling = () => {
  document.body.style.overflow = 'hidden';
};

export const enableScrolling = () => {
  document.body.style.overflow = 'auto';
};

// export const calcCompactCardWidth = (dashBoardSize: number) => {
//   let calcData = dashBoardSize * 0.312;
//   if (calcData < 290) {
//     return 290;
//   }

//   if (dashBoardSize <= 1080) {
//     calcData = Math.ceil(calcData);
//   } else {
//     calcData = Math.floor(calcData);
//   }
//   return calcData;
// };

// export const calcExpandedCardWidth = (dashBoardSize: number) => {
//   let calcData = dashBoardSize * 0.312;
//   if (calcData < 290) {
//     return 290;
//   }

//   if (dashBoardSize <= 1080) {
//     calcData = Math.ceil(calcData);
//   } else {
//     calcData = Math.floor(calcData);
//   }
//   return calcData;
// };
