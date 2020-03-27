export default function(path) {
  return new Promise(resolve => {
    const newImg = new Image();
    newImg.src = path;
    newImg.onload = () => resolve(newImg);
  });
}
