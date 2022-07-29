// funciton to make a public url
export const makeURL = (length: number) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const fileNameValidate = (name: string) => {
  if (name.length < 5) {
    return "Please input valid file name";
  } else if (name.substring(name.length - 4).toLowerCase() !== ".gif") {
    return "Don't change file extention";
  } else if (name.substring(0, name.length - 4).trim() === "") {
    return "Please input valid file name";
  }
  return "";
};
