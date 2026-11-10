const imageToBase64 = async (image) => {
  const reader = new FileReader();
  reader.readAsDataURL(image);
  
  return new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export default imageToBase64;