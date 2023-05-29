import axios from "axios";

axios.defaults.baseURL = "https://api.cookbook.dev";

export const getFilename = (path: string) => {
  const parts = path.split(/[\\/]/);
  const filename = parts[parts.length - 1];
  return filename;
};

export const track = (metric: string, data: any, userID: string) => {
  axios.post(`/track/`, {
    metric,
    data: {
      browser: "vscode",
      deviceType: "vscode",
      platform: "vscode",
      userID,
      ...data,
    },
  });
};

export function genHexString(len: number) {
  const hex = "0123456789ABCDEF";
  let output = "";
  for (let i = 0; i < len; ++i) {
    output += hex.charAt(Math.floor(Math.random() * hex.length));
  }
  return output;
}
