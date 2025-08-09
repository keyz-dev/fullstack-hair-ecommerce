# Backend Deployment Guide for Render

This guide explains how to deploy your Node.js backend with Python ML model to Render.

## Prerequisites

- A Render account
- Your code pushed to a Git repository (GitHub, GitLab, etc.)
- Environment variables configured

## Deployment Steps

### 1. Prepare Your Repository

Ensure your repository contains:

- `render.yaml` - Render configuration
- `build.sh` - Build script
- `requirements.txt` - Python dependencies
- `package.json` - Node.js dependencies
- `src/scripts/predict.py` - ML model script
- `src/scripts/hair_model.h5` - Trained model file

### 2. Connect to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your Git repository
4. Select the repository containing your backend code

### 3. Configure the Service

Render will automatically detect the `render.yaml` configuration:

- **Name**: `braid-commerce-backend`
- **Environment**: Node.js
- **Build Command**: `chmod +x build.sh && ./build.sh`
- **Start Command**: `npm start`
- **Plan**: Starter (free tier)

### 4. Set Environment Variables

In Render dashboard, set these environment variables:

#### Required Variables (set these manually):

- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Secret for JWT tokens
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `REDIS_URL` - Redis connection URL
- `EMAIL_USER` - Email service username
- `EMAIL_PASS` - Email service password

#### Automatic Variables (set by render.yaml):

- `NODE_ENV` - Set to "production"
- `PORT` - Set to 10000
- `PYTHON_PATH` - Set to "/usr/bin/python3"
- `MODEL_PATH` - Set to "/opt/render/project/src/model_api_env"

### 5. Deploy

1. Click "Create Web Service"
2. Render will automatically:
   - Install Node.js dependencies
   - Install Python dependencies
   - Set up the ML model environment
   - Copy model files to the correct location
   - Start your application

### 6. Verify Deployment

Once deployed, test the health endpoint:

```
https://your-service-name.onrender.com/v2/api/health
```

Expected response:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "model": {
    "status": "available",
    "path": "/opt/render/project/src/model_api_env",
    "pythonPath": "/usr/bin/python3"
  },
  "environment": "production"
}
```

## Troubleshooting

### Model Not Available

If the health check shows `"model": {"status": "unavailable"}`:

1. Check build logs in Render dashboard
2. Verify `hair_model.h5` exists in your repository
3. Ensure Python dependencies are installed correctly
4. Check file permissions on the model files

### Build Failures

Common issues:

- **Python version mismatch**: Ensure `runtime.txt` specifies a supported version
- **Memory issues**: TensorFlow installation might fail on free tier
- **File permissions**: Ensure `build.sh` is executable

### Performance Issues

- **Cold starts**: First request after inactivity might be slow
- **Memory limits**: Free tier has limited RAM for ML models
- **Model loading**: Consider model optimization for production

## Model Optimization

For production deployment, consider:

1. **Model quantization**: Reduce model size
2. **Model caching**: Keep model in memory
3. **Batch processing**: Process multiple images together
4. **Model serving**: Use dedicated ML serving infrastructure

## Monitoring

Monitor your deployment:

- Render dashboard metrics
- Application logs
- Health check endpoint
- Model prediction performance

## Support

If you encounter issues:

1. Check Render build logs
2. Verify environment variables
3. Test locally with similar setup
4. Check Render documentation for Node.js + Python deployments
