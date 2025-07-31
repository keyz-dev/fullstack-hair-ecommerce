import React from "react";
import { ImageGrid, Button } from "../../../ui";

const ImagesStep = ({ 
  existingImages,
  newImages,
  onRemoveExisting,
  onRemoveNew,
  onAddImages,
  onBack,
  onNext
}) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-primary mb-6 text-center">Product Images</h2>
      <ImageGrid
        existingImages={existingImages}
        newImages={newImages}
        onRemoveExisting={onRemoveExisting}
        onRemoveNew={onRemoveNew}
        onAddImages={onAddImages}
        label="Product Images"
      />
      
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <Button
          type="button"
          additionalClasses="border border-line_clr text-secondary hover:bg-gray-50"
          onClickHandler={onBack}
        >
          Back
        </Button>
        <Button
          type="button"
          additionalClasses="bg-accent text-white hover:bg-accent/90"
          onClickHandler={onNext}
        >
          Next: Specifications
        </Button>
      </div>
    </div>
  );
};

export default ImagesStep; 