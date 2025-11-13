# EverBloom Review System - Implementation Guide

## Overview
This document describes the complete flower review system implemented for EverBloom, including setup instructions and feature descriptions.

## Features Implemented

### 1. Customer Review System
- ⭐ **Star Rating System**: 1-5 star ratings for each flower
- 📝 **Review Content**: Heading and detailed comment fields
- 📸 **Image Upload**: Customers can upload photos with their reviews (up to 5MB)
- 👤 **User Attribution**: Reviews display customer name and profile photo
- 📊 **Average Ratings**: Product pages show average rating score (e.g., 4.9/5.0)

### 2. Product Page Integration
- **Review Display**: All reviews are shown on individual flower product pages
- **Average Rating Badge**: Shows overall rating with star visualization
- **"Be First to Review" Prompt**: Encourages reviews for products with no feedback yet
- **Write Review Button**: Authenticated users can easily submit reviews
- **Public Viewing**: All account types can view reviews without logging in

### 3. User Account Management
- **My Reviews Tab**: New section in account settings to manage personal reviews
- **Edit Reviews**: Users can update their ratings, headings, comments, and photos
- **Delete Reviews**: Users can remove their own reviews
- **Review History**: See all flowers you've reviewed with thumbnails

### 4. Admin Dashboard
- **Reviews Management Page**: New dashboard section for monitoring all reviews
- **Statistics**: Total reviews, average rating, and low-rating count
- **Follow-Up Feature**: For reviews with 2 stars or less, admins can send follow-up emails
- **Pre-populated Email Template**: Professional message template that can be customized
- **Mock Email System**: Simulates sending emails (doesn't actually send) for demonstration

### 5. Security & Performance
- ✅ **Rate Limiting**: Prevents spam and abuse
- ✅ **Authentication**: Only logged-in users can submit reviews
- ✅ **Authorization**: Users can only edit/delete their own reviews
- ✅ **Admin-Only Features**: Follow-up emails restricted to Admin role
- ✅ **File Upload Validation**: Image type and size restrictions
- ✅ **No Vulnerabilities**: Passed CodeQL security scan

## Database Setup

### Step 1: Import SQL Changes
1. Open phpMyAdmin and select your database:
   - **Production**: `anikadebeer_everbloom_db`
   - **Local**: `everbloom_db`

2. Navigate to the **Import** tab

3. Select the file: `database_updates/add_review_system.sql`

4. Click **Go** to execute

### Step 2: Verify the Update
Check that the `Reviews` table has these columns:
- `review_id` (Primary Key)
- `flower_id` (Foreign Key to Flowers)
- `user_id` (Foreign Key to Users)
- `rating` (1-5 integer)
- `heading` (varchar 255)
- `comment` (text)
- `image_url` (varchar 500)
- `createdAt` (datetime)
- `updatedAt` (datetime)

### Important Notes
- ⚠️ **Backup First**: Always backup your database before running migrations
- ⚠️ **Data Loss**: The old Reviews table (order-based) will be replaced
- ⚠️ The new system uses `flower_id` instead of `order_id`

## Frontend Routes

### Public Routes
- `/product/:id` - Product page with reviews

### User Routes (Authenticated)
- `/account` - Account settings with "My Reviews" tab

### Admin Routes (Admin only)
- `/dashboard/reviews` - Review management dashboard

## API Endpoints

### Public Endpoints
```
GET /api/reviews/flower/:flowerId
```
Get all reviews for a specific flower with average rating.

### Authenticated Endpoints
```
POST /api/reviews
Body: { flower_id, rating, heading, comment }
File: reviewImage (optional)
```
Create a new review.

```
GET /api/reviews/my-reviews
```
Get current user's reviews.

```
PUT /api/reviews/:reviewId
Body: { rating, heading, comment }
File: reviewImage (optional)
```
Update own review.

```
DELETE /api/reviews/:reviewId
```
Delete own review.

### Admin Endpoints
```
GET /api/reviews
```
Get all reviews (admin dashboard).

```
POST /api/reviews/:reviewId/follow-up
Body: { message }
```
Send follow-up email for bad reviews (mock).

## How to Use

### As a Customer
1. Browse to any flower product page
2. Scroll to the "Customer Reviews" section
3. Click "Write a Review" (login required)
4. Fill in:
   - Star rating (1-5)
   - Heading (optional)
   - Review text (required)
   - Upload photo (optional)
5. Click "Submit Review"
6. Manage reviews from Account > My Reviews tab

### As an Admin
1. Navigate to Dashboard > Reviews
2. View all reviews with statistics
3. For low-rated reviews (2 stars or less):
   - Click "Follow Up" button
   - Edit the pre-populated email message
   - Click "Send Email" (mock, not actually sent)

## Styling & Branding

All components follow EverBloom's design system:
- **Primary Color**: `#de0d22` (red)
- **Accent Color**: `#FCB207` (gold for stars)
- **Font**: Poppins (body), Losta Masta (headings)
- **Modern Cards**: Rounded corners, subtle shadows, hover effects
- **Responsive Design**: Mobile-friendly layouts

## File Structure

### Backend
```
backend/
├── models/Review.js          # Updated review model
├── controllers/reviewController.js  # Review CRUD operations
├── routes/reviewRoutes.js    # API endpoints with auth & rate limiting
└── uploads/reviews/          # Uploaded review images
```

### Frontend
```
client/src/
├── components/
│   ├── ReviewCard.js         # Display individual review
│   ├── ReviewCard.css
│   ├── AddReviewForm.js      # Review submission form
│   └── AddReviewForm.css
├── pages/
│   ├── ProductPage.js        # Product page with reviews
│   ├── ProductPage.css
│   ├── Account.js            # User account with reviews tab
│   ├── Account.css
│   └── dashboard/
│       ├── DashboardReviews.js  # Admin review management
│       └── Dashboard.css
└── App.js                    # Added reviews route
```

### Database
```
database_updates/
├── README.md                 # Import instructions
└── add_review_system.sql     # Migration script
```

## Testing Checklist

Before deploying to production, test:

- [ ] Submit a review as a logged-in customer
- [ ] Upload an image with a review
- [ ] View reviews on a product page
- [ ] Edit a review from account settings
- [ ] Delete a review from account settings
- [ ] View average rating on product page
- [ ] See "Be first to review" on products with no reviews
- [ ] Admin: View all reviews in dashboard
- [ ] Admin: Send follow-up email for low-rated review
- [ ] Verify rate limiting prevents spam
- [ ] Check responsive design on mobile

## Troubleshooting

### Reviews not showing up?
- Ensure you've imported the SQL migration
- Check that flower_id exists in the Flowers table
- Verify API endpoint returns data: `/api/reviews/flower/{id}`

### Can't upload images?
- Check upload directory exists: `backend/uploads/reviews/`
- Verify file size is under 5MB
- Ensure file type is: jpeg, jpg, png, gif, or webp

### Admin features not working?
- Confirm user has "Admin" role in database
- Check browser console for authorization errors
- Verify backend authentication middleware is working

## Future Enhancements

Consider these improvements:
- 📧 Real email integration (currently mocked)
- 👍 Helpful/unhelpful voting on reviews
- 🔍 Filter/sort reviews by rating, date, helpfulness
- ✅ Verified purchase badge
- 📊 Review analytics and insights
- 🏆 Incentivize reviews with rewards points

## Support

For questions or issues:
1. Check the console for error messages
2. Review the API endpoint responses
3. Verify database schema matches expected structure
4. Ensure all dependencies are installed: `npm install`

---

**Built with ❤️ for EverBloom**
