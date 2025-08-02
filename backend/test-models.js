// Simple test file to validate our models and basic functionality
const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Post = require('./src/models/post');
const Comment = require('./src/models/comment');
const User = require('./src/models/user');

async function testModels() {
  try {
    console.log('🔍 Testing model validation...');
    
    // Test Post model validation
    console.log('\n📝 Testing Post model...');
    
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
      console.log('❌ Image post validation failed:', imageValidation.message);
    } else {
      console.log('✅ Image post validation passed');
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
      console.log('❌ Video post validation failed:', videoValidation.message);
    } else {
      console.log('✅ Video post validation passed');
    }
    
    // Test Comment model validation
    console.log('\n💬 Testing Comment model...');
    
    const comment = new Comment({
      post: new mongoose.Types.ObjectId(),
      author: new mongoose.Types.ObjectId(),
      content: 'This is a test comment'
    });
    
    const commentValidation = comment.validateSync();
    if (commentValidation) {
      console.log('❌ Comment validation failed:', commentValidation.message);
    } else {
      console.log('✅ Comment validation passed');
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
      console.log('❌ Reply comment validation failed:', replyValidation.message);
    } else {
      console.log('✅ Reply comment validation passed');
    }
    
    console.log('\n🎉 Model validation tests completed!');
    
    // Test virtual properties
    console.log('\n🔗 Testing virtual properties...');
    
    // Add some likes to test virtuals
    imagePost.likes.push({ user: new mongoose.Types.ObjectId() });
    imagePost.likes.push({ user: new mongoose.Types.ObjectId() });
    
    console.log(`✅ Image post like count: ${imagePost.likeCount}`);
    console.log(`✅ Image post engagement rate: ${imagePost.engagementRate}%`);
    
    comment.likes.push({ user: new mongoose.Types.ObjectId() });
    console.log(`✅ Comment like count: ${comment.likeCount}`);
    console.log(`✅ Comment is reply: ${replyComment.isReply}`);
    
    console.log('\n✨ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests
testModels();
