import React, { useState } from "react";
import IconButton from "./icon-button";
import BaseOverlay from "./overlay";

interface ImageBoxProps {
  src: string;
  isEdit?: boolean;

  onRemove?: () => void;
}

const ImageBox = ({ src, isEdit = false, onRemove }: ImageBoxProps) => {
  const [expand, setExpand] = useState<boolean>(false);

  return (
    <div className="relative w-48 h-32 border rounded-[4px] overflow-hidden">
      {isEdit ? (
        <IconButton
          bgClassName="absolute right-0 top-0 hover:bg-red-50 bg-white/70"
          className="text-red-500"
          icon="Trash2"
          onClick={onRemove}
        />
      ) : null}
      <img
        className="w-full h-full"
        src={src}
        alt="이미지"
        onClick={() => setExpand(true)}
      />
      {expand ? (
        <BaseOverlay
          isOpen={expand}
          onBackClick={() => {
            setExpand(false);
          }}
        >
          <img src={src} alt="이미지" />
        </BaseOverlay>
      ) : null}
    </div>
  );
};

export default ImageBox;
