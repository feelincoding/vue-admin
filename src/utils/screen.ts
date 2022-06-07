export const disableScrolling = () => {
  const x = window.scrollX;
  const y = window.scrollY;
  window.onscroll = () => {
    window.scrollTo(x, y);
  };
};

export const enableScrolling = () => {
  window.onscroll = () => {
    return;
  };
};

export const calcCompactCardWidth = (dashBoardSize: number) => {
  let calcData = dashBoardSize * 0.312;
  if (calcData < 290) {
    return 290;
  }

  if (dashBoardSize <= 1080) {
    calcData = Math.ceil(calcData);
  } else {
    calcData = Math.floor(calcData);
  }
  return calcData;
};

export const calcExpandedCardWidth = (dashBoardSize: number) => {
  let calcData = dashBoardSize * 0.312;
  if (calcData < 290) {
    return 290;
  }

  if (dashBoardSize <= 1080) {
    calcData = Math.ceil(calcData);
  } else {
    calcData = Math.floor(calcData);
  }
  return calcData;
};
