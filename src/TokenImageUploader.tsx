import ImageUploader from 'react-image-upload';

type FileWrapper = {
  file: File;
};

const allowedExtensions = ['svg' /*, 'png', 'jpg'*/];
const maxImgKbSize = 170 * 1024;

export function TokenImageUploader(props: {
  setImage: (content: string) => void;
}) {
  const getImageFileObject = async (imageFile: FileWrapper) => {
    const img = imageFile.file;
    if (!img) return;
    if (img.size > maxImgKbSize) {
      throw new Error(`Max image size is ${maxImgKbSize / 1024}kb`);
    }
    const imgContent = await img!.text();
    // const arr = await img.arrayBuffer();
    // const imgContent = arrayBufferToBase64(arr); for png/jpg
    const imgExt = img.name.split('.').pop()!;
    if (!allowedExtensions.includes(imgExt)) {
      throw new Error('Only .svg image type is supported');
    }
    props.setImage(imgContent);
  };
  function runAfterImageDelete(_: FileWrapper) {
    props.setImage('');
  }

  return (
    <ImageUploader
      onFileAdded={(img: FileWrapper) => getImageFileObject(img)}
      onFileRemoved={(img: FileWrapper) => runAfterImageDelete(img)}
    />
  );
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  // TODO  O(n^2) :(
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  console.log('before', binary);
  (window as any).binary = binary;
  // const after = window.btoa(binary);
  // console.log('after', after);
  return binary;
}
