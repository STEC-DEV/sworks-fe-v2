import React, { useState } from "react";
import IconButton from "./icon-button";
import BaseOverlay from "./overlay";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

interface ImageBoxProps {
  src: string;
  isEdit?: boolean;
  onRemove?: () => void;
}

const ImageBox = ({ src, isEdit = false, onRemove }: ImageBoxProps) => {
  const [expand, setExpand] = useState<boolean>(false);

  return (
    <>
      <div className="relative w-48 h-32 border rounded-[4px] overflow-hidden shrink-0">
        {isEdit ? (
          <div className="absolute right-0 top-0 z-20">
            <IconButton
              bgClassName="hover:bg-red-50 bg-white/70 z-10"
              className="text-red-500"
              icon="Trash2"
              onClick={onRemove}
            />
          </div>
        ) : null}
        <Image
          fill
          className="object-cover cursor-pointer"
          src={src}
          alt="이미지"
          onClick={() => setExpand(true)}
        />
      </div>

      {/* Portal을 relative div 밖으로 분리 */}
      {expand ? (
        <BaseOverlay
          isOpen={expand}
          onBackClick={() => {
            setExpand(false);
          }}
        >
          <div className="flex items-center justify-center w-full h-full p-4">
            <div className="relative max-w-[90vw] max-h-[90vh]">
              <Image
                src={src}
                width={0}
                height={0}
                sizes="90vw"
                style={{
                  width: "auto",
                  height: "auto",
                  maxWidth: "90vw",
                  maxHeight: "90vh",
                }}
                alt="이미지"
              />
            </div>
          </div>
        </BaseOverlay>
      ) : null}
    </>
  );
};

export default ImageBox;

export const ImageBoxDialog = ({
  src,
  isEdit = false,
  onRemove,
}: ImageBoxProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative  w-48 h-32">
          <Image fill src={src} alt="image" />
          {isEdit && (
            <IconButton
              bgClassName="absolute right-0 top-0 hover:bg-red-50 bg-white/70"
              className="text-red-500"
              icon="Trash2"
              onClick={onRemove}
            />
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="w-fit h-fit max-w-[90vw] max-h-[90vh] p-0">
        <Image
          src={src}
          alt="image"
          width={0}
          height={0}
          sizes="100vw"
          className="w-auto h-auto max-w-[85vw] max-h-[85vh]"
          style={{ width: "auto", height: "auto" }}
        />
      </DialogContent>
    </Dialog>
  );
};

export const SingleImageBox = ({ path }: { path: string }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Image
        fill
        src={path}
        alt="img"
        className="w-full h-full object-cover cursor-pointer"
        onClick={() => {
          setOpen(true);
        }}
      />
      {open && (
        <BaseOverlay isOpen={open} onBackClick={() => setOpen(false)}>
          <div className="flex items-center justify-center w-full h-full p-4">
            <div className="relative max-w-[90vw] max-h-[90vh]">
              <Image
                src={path}
                width={0}
                height={0}
                sizes="90vw"
                style={{
                  width: "auto",
                  height: "auto",
                  maxWidth: "90vw",
                  maxHeight: "90vh",
                }}
                alt="이미지"
              />
            </div>
          </div>
        </BaseOverlay>
      )}
    </>
  );
};
