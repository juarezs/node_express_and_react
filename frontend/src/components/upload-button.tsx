import { ReactNode, useRef } from "react";
import { Button } from "./ui/button";

export default function UploadButton({onSelect, children, ...props} : {onSelect: (files: FileList | null) => void; children: ReactNode}) {
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    hiddenFileInput?.current?.click();   
  };

  return (
    <>
      <Button {...props} onClick={handleClick} >{children}</Button>
      <input
        data-testid="upload-file"
        type="file"
        onChange={e => onSelect(e.target.files)}
        ref={hiddenFileInput}
        style={{display: 'none'}}
        value=""
      />
    </>
  );
}
