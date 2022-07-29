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
