import React from "react";
import { ImageIcon } from "lucide-react";
import { Button } from "../../../../ui";

const DragDropArea = ({ onDragOver, onDrop, onBrowseClick, isUploading }) => {
  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-sm p-12 text-center"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-blue-50 rounded-sm flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-accent" />
        </div>
        <div>
          <h3 className="font-medium text-primary">Drag and Drop</h3>
          <p className="text-sm text-secondary mt-1">
            or browse for photos. Images will be validated when you click
            Upload.
          </p>
        </div>
        <Button
          onClickHandler={onBrowseClick}
          additionalClasses="primarybtn min-h-fit min-w-fit px-6 py-2"
          isDisabled={isUploading}
        >
          Browse
        </Button>
      </div>
    </div>
  );
};

export default DragDropArea;
