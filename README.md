# 🔭 NASA API Asteroid Monitoring
Created by: Jake Medica, Nate Moser, Vishal Suthakar, Payton Lin

Group Name: Saja Boys
For University of Pittsburgh — INFSCI 1570 (Fall 2025)

# 🗒️ Description

This web application retrieves live asteroid data from NASA’s Near-Earth Object Web Service (NeoWs) and presents it through an interactive dashboard. Users can:

Browse asteroids

View real-time close-approach information

Visualize asteroid orbits graphically

Create accounts (email/password or GitHub OAuth)

Save favorite asteroids to their profile

The system uses a full MERN-style architecture (MongoDB, Express, React, Node.js) and includes secure authentication and session management.

# 🥞 Tech Stack
Frontend

React.js

HTML5 Canvas API (Orbit Diagram)

CSS (custom styles + responsive layout)

Backend

Node.js

Express.js

# REST API architecture

Passport.js (GitHub OAuth + local strategy)

express-session + MongoStore

Database

MongoDB Atlas

Mongoose ODM

External APIs

NASA NeoWs API (Asteroid Feed, Browse, and Detail endpoints)

🚀 Setup Instructions
# Clone repository
git clone <your-repo-url>

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Create .env files (server/.env)
MONGO_URI=your_mongo_atlas_uri
SESSION_SECRET=your_secret_key
NASA_API_KEY=your_nasa_key
GITHUB_CLIENT_ID=your_id
GITHUB_CLIENT_SECRET=your_secret

# Start backend
cd server
npm run dev

# Start frontend
cd ../client
npm start


Once running:
Frontend: http://localhost:3000

Backend API: http://localhost:4000
Frontend: http://localhost:3000

Backend API: http://localhost:4000
