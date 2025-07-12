export function fileToDataURI(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function convertFilesToDataURIs(obj: any): Promise<any> {
  if (obj instanceof File) {
    return await fileToDataURI(obj);
  } else if (Array.isArray(obj)) {
    return Promise.all(obj.map((item) => convertFilesToDataURIs(item)));
  } else if (obj && typeof obj === 'object') {
    const result: any = {};
    for (const key of Object.keys(obj)) {
      result[key] = await convertFilesToDataURIs(obj[key]);
    }
    return result;
  }
  return obj;
}
