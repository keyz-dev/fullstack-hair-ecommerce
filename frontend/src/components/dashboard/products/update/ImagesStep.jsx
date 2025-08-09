import React from "react";
import { ImageGrid, Button } from "../../../ui";
import { Loader2 } from "lucide-react";

const ImagesStep = ({
  existingImages,
  newImages,
  onRemoveExisting,
  onRemoveNew,
  onAddImages,
  onBack,
  onNext,
  // Validation props
  validationStates,
  getValidationState,
  canProceed,
  hasPendingValidations,
}) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-primary mb-6 text-center">
        Product Images
      </h2>

      <ImageGrid
        existingImages={existingImages}
        newImages={newImages}
        onRemoveExisting={onRemoveExisting}
        onRemoveNew={onRemoveNew}
        onAddImages={onAddImages}
        label="Product Images"
        validationStates={validationStates}
        getValidationState={getValidationState}
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
          additionalClasses={`${
            canProceed()
              ? "bg-accent text-white hover:bg-accent/90"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          onClickHandler={onNext}
          disabled={!canProceed()}
        >
          {hasPendingValidations() ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Validating...</span>
            </div>
          ) : (
            "Next: Specifications"
          )}
        </Button>
      </div>
    </div>
  );
};

export default ImagesStep;
