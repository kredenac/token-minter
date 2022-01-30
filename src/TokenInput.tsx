import { useCallback, useState } from 'react';
import ImageUploader from 'react-image-upload';
import 'react-image-upload/dist/index.css';
import { PullRequester } from './PrMaker';

type FileWrapper = {
  file: File;
};

const allowedExtensions = ['svg' /*, 'png', 'jpg'*/];
const maxImgKbSize = 170 * 1024;
export function TokenInput() {
  const [img, setImg] = useState<File | undefined>();

  const getImageFileObject = async (imageFile: FileWrapper) => {
    setImg(imageFile.file);
  };
  function runAfterImageDelete(file: FileWrapper) {
    setImg(undefined);
  }

  const onClick = useCallback(async () => {
    if (!img) {
      console.log('img is undefined');
      return;
    }
    if (img.size > maxImgKbSize) {
      console.log('max size is:', maxImgKbSize);
      return;
    }
    const imgContent = await img!.text();
    // const arr = await img.arrayBuffer();
    // console.log(arr);
    // const imgContent = arrayBufferToBase64(arr); for png/jpg
    const imgExt = img.name.split('.').pop()!;
    if (!allowedExtensions.includes(imgExt)) {
      // TODO: encoding for png gets banged up
      console.log('Only .svg image type is supported');
      return;
    }

    PullRequester.makePR(imgContent, imgExt);
  }, [img]);

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
