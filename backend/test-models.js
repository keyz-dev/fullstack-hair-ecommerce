// Simple test file to validate our models and basic functionality
const mongoose = require('mongoose');
require('dotenv').config();
const logger = require('./src/utils/logger');

// Import models
const Post = require('./src/models/post');
const Comment = require('./src/models/comment');
const User = require('./src/models/user');

async function testModels() {
  try {
        logger.info('🔍 Testing model validation...');
    
    // Test Post model validation
        logger.info('\n📝 Testing Post model...');
    
    // Test valid image post
    const imagePost = new Post({
      title: 'Test Image Post',
      description: 'This is a test image post',
      author: new mongoose.Types.ObjectId(),
      postType: 'work-showcase',
      mediaType: 'images',
      images: [
        { url: 'https://example.com/image1.jpg', caption: 'Image 1', order: 1 },
        { url: 'https://example.com/image2.jpg', caption: 'Image 2', order: 2 }
      ],
      slug: 'test-image-post'
    });
    
    const imageValidation = imagePost.validateSync();
    if (imageValidation) {
            logger.error('❌ Image post validation failed:', imageValidation.message);
    } else {
            logger.info('✅ Image post validation passed');
    }
    
    // Test valid video post
    const videoPost = new Post({
      title: 'Test Video Post',
      description: 'This is a test video post',
      author: new mongoose.Types.ObjectId(),
      postType: 'tutorial',
      mediaType: 'video',
      video: {
        url: 'https://example.com/video.mp4',
        thumbnail: 'https://example.com/thumbnail.jpg',
        caption: 'Tutorial video'
      },
      slug: 'test-video-post'
    });
    
    const videoValidation = videoPost.validateSync();
    if (videoValidation) {
            logger.error('❌ Video post validation failed:', videoValidation.message);
    } else {
            logger.info('✅ Video post validation passed');
    }
    
    // Test Comment model validation
        logger.info('\n💬 Testing Comment model...');
    
    const comment = new Comment({
      post: new mongoose.Types.ObjectId(),
      author: new mongoose.Types.ObjectId(),
      content: 'This is a test comment'
    });
    
    const commentValidation = comment.validateSync();
    if (commentValidation) {
            logger.error('❌ Comment validation failed:', commentValidation.message);
    } else {
            logger.info('✅ Comment validation passed');
    }
    
    // Test reply comment
    const replyComment = new Comment({
      post: new mongoose.Types.ObjectId(),
      author: new mongoose.Types.ObjectId(),
      content: 'This is a reply',
      parentComment: new mongoose.Types.ObjectId()
    });
    
    const replyValidation = replyComment.validateSync();
    if (replyValidation) {
            logger.error('❌ Reply comment validation failed:', replyValidation.message);
    } else {
            logger.info('✅ Reply comment validation passed');
    }
    
        logger.info('\n🎉 Model validation tests completed!');
    
    // Test virtual properties
        logger.info('\n🔗 Testing virtual properties...');
    
    // Add some likes to test virtuals
    imagePost.likes.push({ user: new mongoose.Types.ObjectId() });
    imagePost.likes.push({ user: new mongoose.Types.ObjectId() });
    
        logger.info(`✅ Image post like count: ${imagePost.likeCount}`);
        logger.info(`✅ Image post engagement rate: ${imagePost.engagementRate}%`);
    
    comment.likes.push({ user: new mongoose.Types.ObjectId() });
        logger.info(`✅ Comment like count: ${comment.likeCount}`);
        logger.info(`✅ Comment is reply: ${replyComment.isReply}`);
    
        logger.info('\n✨ All tests completed successfully!');
    
  } catch (error) {
        logger.error('❌ Test failed:', error.message);
  }
}

// Run tests
testModels();
