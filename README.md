# Fork & Friends Server Side

![Express](https://img.shields.io/badge/Express-4.21+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-6.14+-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-18+-blue)
![Mongoose](https://img.shields.io/badge/Mongoose-8.12+-red)
![Natural](https://img.shields.io/badge/Natural_NLP-8.0+-orange)

Backend API for Fork & Friends - a comprehensive data analysis and social recommendation platform leveraging the Yelp dataset. This server provides robust endpoints for analyzing 6.6+ million reviews and 192,000+ businesses, delivering intelligent insights through advanced data processing, natural language processing, and machine learning algorithms.

## Important Links

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_Site-2ea44f?style=for-the-badge&logo=vercel)](https://fork-and-friends.onrender.com/)
[![Client Repository](https://img.shields.io/badge/Client_Code-GitHub-blue?style=for-the-badge&logo=github)](https://github.com/NasimRanaFeroz/Fork-Friends_Front-End)
[![Server Repository](https://img.shields.io/badge/Server_Code-GitHub-blue?style=for-the-badge&logo=github)](https://github.com/mdnezam-uddin/Fork-Friends_Back-End)
[![Data Analysis](https://img.shields.io/badge/Big_Data_Analysis-GitHub-orange?style=for-the-badge&logo=github)](https://github.com/azizerorahman/Fork-Friends_Yelp-Analysis)

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)

## Features

- **Big Data Analytics**: Process and analyze 6.6+ million Yelp reviews across 192,000+ businesses
- **Natural Language Processing**: Advanced text analysis using Natural.js for sentiment analysis and word extraction
- **High-Performance Caching**: NodeCache implementation for optimized response times
- **Rate Limiting**: Express rate limiting for API security and performance
- **Business Intelligence**: Comprehensive business analytics including ratings, categories, and geographic insights
- **User Analytics**: Deep user behavior analysis including elite status tracking and engagement metrics
- **Review Analysis**: Sentiment analysis, word clouds, and association graphs from review data
- **Geographic Analysis**: City and state-based business and user insights
- **Check-in Analytics**: Temporal and geographic check-in pattern analysis
- **RESTful API Design**: Clean, scalable API architecture with modular controllers
- **MongoDB Integration**: Optimized database queries with Mongoose ODM
- **CORS Support**: Cross-origin resource sharing for frontend integration

## Technologies Used

- **Node.js**: JavaScript runtime environment for server-side development
- **Express.js**: Fast, unopinionated web framework for Node.js
- **MongoDB**: NoSQL database for storing large-scale Yelp dataset
- **Mongoose**: MongoDB object modeling for Node.js
- **Natural.js**: Natural language processing library for text analysis
- **NodeCache**: In-memory caching solution for performance optimization
- **Express Rate Limit**: Rate limiting middleware for API protection
- **CORS**: Cross-Origin Resource Sharing middleware
- **dotenv**: Environment variable management

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- MongoDB (v6.0 or higher) or MongoDB Atlas account
- npm (Node Package Manager)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/mdnezam-uddin/Fork-Friends_Back-End.git
   cd Fork-Friends_Back-End
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory:

   ```env
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/yelp
   # or for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/yelp
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   ```

4. Start the development server:

   ```bash
   npm run dev
   # or for production
   npm start
   ```

5. The server will be running at `http://localhost:5000`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/yelp |
| PORT | Server port number | 5001 |
| NODE_ENV | Environment mode (development/production) | development |

## API Endpoints

### Base URL: `/api`

#### Business Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/business/top-merchants` | Get top-performing merchants by review count |
| GET | `/business/top-cities` | Get cities with highest business density |
| GET | `/business/top-states` | Get states with most businesses |
| GET | `/business/top-rated-cities` | Get cities with highest average ratings |
| GET | `/business/category-stats` | Get business category distribution statistics |
| GET | `/business/top-rated-merchants` | Get highest-rated businesses |
| GET | `/business/restaurant-analysis` | Get detailed restaurant type analysis |

#### User Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user/yearly-joins` | Get user registration trends by year |
| GET | `/user/top-reviewers` | Get users with most reviews |
| GET | `/user/most-popular` | Get most popular users by social metrics |
| GET | `/user/elite-to-regular-ratio` | Get elite vs regular user statistics |
| GET | `/user/silent-active-proportions` | Get active vs silent user analysis |

#### Review Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/review/count-by-year` | Get review count trends by year |
| GET | `/review/count-useful-funny-cool` | Get review engagement metrics |
| GET | `/review/rank-users-by-reviews` | Get user rankings by review activity |
| GET | `/review/top-20-common-words` | Get most common words in reviews |
| GET | `/review/top-10-positive-words` | Get most positive sentiment words |
| GET | `/review/top-10-negative-words` | Get most negative sentiment words |
| GET | `/review/word-cloud-analysis` | Get word cloud data for visualization |
| GET | `/review/word-association-graph` | Get word association network data |

#### Rating Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/rating/distribution` | Get rating distribution (1-5 stars) |
| GET | `/rating/weekly` | Get weekly rating patterns |
| GET | `/rating/top-five-star` | Get businesses with highest ratings |
| GET | `/rating/stats` | Get comprehensive rating statistics |

#### Check-in Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/checkin/checkins-per-year` | Get check-in trends by year |
| GET | `/checkin/checkins-per-hour` | Get hourly check-in patterns |
| GET | `/checkin/popular-checkin-cities` | Get cities with most check-ins |
| GET | `/checkin/businesses-by-checkins` | Get businesses ranked by check-ins |

#### Comprehensive Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/comprehensive/city-top-merchants` | Get top merchants by city with combined metrics |

## Project Structure

```text
Fork-Friends_Back-End/
├── config/
│   └── db.js
├── controllers/
│   ├── businessController.js
│   ├── checkinController.js
│   ├── comprehensiveController.js
│   ├── ratingController.js
│   ├── reviewController.js
│   └── userController.js
├── models/
│   ├── Business.js
│   ├── Checkin.js
│   ├── Review.js
│   └── User.js
├── routes/
│   ├── businessRoutes.js
│   ├── checkinRoutes.js
│   ├── comprehensiveRoutes.js
│   ├── ratingRoutes.js
│   ├── reviewRoutes.js
│    userRoutes.js
├── .env
├── .gitignore
├── app.js
├── package.json
├── package-lock.json
└── README.md
```

## Contributors

- **[Azizur Rahman](https://github.com/azizerorahman/)** - Project Lead & Full-Stack Developer
- **[Nasim Rana Feroz](https://github.com/nasimranaferoz/)** - Frontend Developer & UI/UX Designer
- **[MD Nezam Uddin](https://github.com/mdnezamuddin/)** - Backend Developer & Database Engineer

[![Contributors](https://contrib.rocks/image?repo=nasimranaferoz/Fork-Friends_Front-End)](https://github.com/nasimranaferoz/Fork-Friends_Front-End/graphs/contributors)

---

**Note**: This project processes the publicly available [Yelp Open Dataset](https://business.yelp.com/data/resources/open-dataset/) for educational and research purposes. All data analysis is performed on anonymized data in compliance with Yelp's terms of service and privacy guidelines.
