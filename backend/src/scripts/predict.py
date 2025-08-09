import sys
import os
import tensorflow as tf
import numpy as np
from PIL import Image
import json
import warnings
import gc

# Suppress all warnings
warnings.filterwarnings('ignore')
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

# Memory optimization settings
os.environ['TF_FORCE_GPU_ALLOW_GROWTH'] = 'true'
os.environ['TF_MEMORY_GROWTH'] = 'true'

# Disable TensorFlow logging
tf.get_logger().setLevel('ERROR')

def cleanup_memory():
    """Clean up memory to prevent crashes"""
    try:
        gc.collect()
        # Force garbage collection multiple times
        for _ in range(3):
            gc.collect()
    except:
        pass

# --- 1. DEFINE CONSTANTS AND LOAD THE MODEL ---
IMG_HEIGHT = 180
IMG_WIDTH = 180
CLASS_NAMES = ['hair', 'other'] # Must match the order from training!

# Global model variable
model = None

def load_model():
    """Load the trained model with error handling"""
    global model
    try:
        print("Loading model...", file=sys.stderr)
        
        # Try loading without compilation first
        try:
            model = tf.keras.models.load_model(
                os.path.join(os.path.dirname(__file__), 'hair_model.h5'),
                compile=False
            )
            print("Model loaded without compilation", file=sys.stderr)
        except Exception as compile_error:
            print(f"Failed to load without compilation: {compile_error}", file=sys.stderr)
            # Try with custom objects
            model = tf.keras.models.load_model(
                os.path.join(os.path.dirname(__file__), 'hair_model.h5'),
                custom_objects={
                    'loss': tf.keras.losses.SparseCategoricalCrossentropy(from_logits=False, reduction='none')
                },
                compile=False
            )
            print("Model loaded with custom objects", file=sys.stderr)
        
        print("Model loaded successfully", file=sys.stderr)
        return True
    except Exception as e:
        print(f"Failed to load model: {e}", file=sys.stderr)
        return False

# Load model at startup
if not load_model():
    print(json.dumps({"error": "Model could not be loaded.", "details": "Failed to initialize model"}))
    sys.exit(1)

# --- 2. DEFINE THE PREDICTION FUNCTION ---
def predict(image_path):
    try:
        print(f"Loading image: {image_path}", file=sys.stderr)
        
        # Load and preprocess the image
        img = Image.open(image_path).resize((IMG_WIDTH, IMG_HEIGHT))
        if img.mode == 'RGBA': # Handle PNGs with transparency
            img = img.convert('RGB')
        
        print("Image loaded and resized", file=sys.stderr)
        
        img_array = tf.keras.utils.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0) # Create a batch

        print("Making prediction...", file=sys.stderr)
        # Make a prediction
        predictions = model.predict(img_array, verbose=0)
        scores = tf.nn.softmax(predictions[0]) # Convert raw scores to probabilities

        print("Prediction completed", file=sys.stderr)
        
        # Prepare the JSON response
        result = {
            "prediction": CLASS_NAMES[np.argmax(scores)],
            "confidence": {
                "hair": float(scores[0]),
                "other": float(scores[1])
            }
        }
        
        # Clean up memory
        del img_array, predictions, scores
        cleanup_memory()
        
        return json.dumps(result)

    except Exception as e:
        print(f"Error in prediction: {str(e)}", file=sys.stderr)
        # Clean up memory on error
        cleanup_memory()
        error_result = json.dumps({"error": "Prediction failed.", "details": str(e)})
        print(error_result)
        sys.stdout.flush()
        return error_result

# --- 3. EXECUTE THE SCRIPT ---
if __name__ == "__main__":
    try:
        # Single-image mode only
        if len(sys.argv) > 1:
            image_path_from_node = sys.argv[1]
            print(f"Processing image: {image_path_from_node}", file=sys.stderr)
            
            # Validate image path exists
            if not os.path.exists(image_path_from_node):
                error_msg = json.dumps({"error": "Image file not found.", "details": f"Path: {image_path_from_node}"})
                print(error_msg)
                sys.stdout.flush()
                sys.exit(1)
            
            prediction_json = predict(image_path_from_node)
            print(prediction_json) # This is the output Node.js will receive
            sys.stdout.flush()
            
            # Add a small delay to ensure output is flushed
            import time
            time.sleep(0.1)
            
            # Final cleanup
            cleanup_memory()
        else:
            error_msg = json.dumps({"error": "No image path provided."})
            print(error_msg)
            sys.stdout.flush()
            sys.exit(1)
    except Exception as e:
        error_msg = json.dumps({"error": "Script execution failed.", "details": str(e)})
        print(error_msg)
        sys.stdout.flush()
        sys.exit(1)
    finally:
        # Ensure clean exit
        try:
            if model is not None:
                del model
            cleanup_memory()
        except:
            pass