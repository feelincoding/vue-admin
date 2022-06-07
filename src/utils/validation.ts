export const checkEmail = (email: string) => {
  const r =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return r.test(String(email));
};

export const checkTel = (tel: string) => {
  const r = /^\d{2,3}\d{3,4}\d{4}$/;
  return r.test(String(tel));
};

export const checkLength = (value: string, min: number, max: number) => {
  return value.length >= min && value.length <= max;
};
export const checkEmpty = (value: string) => {
  return value.length !== 0;
};

export const checkNumber = (value: string) => {
  const r = /^[0-9]*$/;
  return r.test(String(value));
};

export const checkEnglishNumber = (value: string) => {
  const r = /^[a-zA-Z0-9]*$/;
  return r.test(String(value));
};

export const checkEnglishKorean = (value: string) => {
  const r = /^[A-Za-zㄱ-ㅎ가-힣]+$/;
  return r.test(String(value));
};

export const checkEnglishNumberKorean = (value: string) => {
  const r = /^[a-zA-Z0-9가-힣]*$/;
  return r.test(String(value));
};

export const checkOnlyEnglishAndNumber = (value: string) => {
  const r = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]*$/;
  return r.test(String(value));
};

export const checkEnglishNumberKoreanSpacialChar = (value: string) => {
  const r = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]*$/;
  return r.test(String(value));
};

export const checkDomain = (value: string) => {
  console.log(value);
  const r = /^(([a-zA-Z\-0-9]+\.)+[a-zA-Z0-9]{1,5})/gi;
  if (value === 'localhost') {
    return true;
  }
  return r.test(String(value));
};
