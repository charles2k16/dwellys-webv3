let url = () => {
  let url;
  if (process.env.NODE_ENV === 'development') {
    url = `https://newapi.dwellys.com`;
  } else {
    url = `https://newapi.dwellys.com`;
  }
  return url;
};
export default url;
