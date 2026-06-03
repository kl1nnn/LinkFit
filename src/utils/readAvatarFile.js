const AVATAR_SIZE = 320;

export default function readAvatarFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Não foi possível ler a imagem."));
    reader.onload = () => {
      const image = new Image();

      image.onerror = () => reject(new Error("Não foi possível carregar a imagem."));
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const side = Math.min(image.width, image.height);
        const sourceX = (image.width - side) / 2;
        const sourceY = (image.height - side) / 2;

        canvas.width = AVATAR_SIZE;
        canvas.height = AVATAR_SIZE;
        context.drawImage(image, sourceX, sourceY, side, side, 0, 0, AVATAR_SIZE, AVATAR_SIZE);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };

      image.src = reader.result;
    };

    reader.readAsDataURL(file);
  });
}
