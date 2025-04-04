
# MiniFlix

This is a Nuxt.js project for a movie app inspired by Netflix. It uses the TMDB API to fetch movie data and display it in a responsive, glassmorphism-styled design.

## Prerequisites

Before setting up the project, ensure you have the following installed on your machine:

- Node.js (v18 or above)
- npm
- Git

## Setup Instructions

### 1. Clone the Repository

Clone this repository to your local machine:

```bash
git clone https://github.com/surajsingh2/miniflix.git
cd miniflix
```

### 2. Install Dependencies

Install the required dependencies:

```bash
npm install
```

### 3. Get TMDB API Key

To access movie data, you'll need a TMDB API key. Follow these steps to get one:

    1. Go to the [TMDB website](https://www.themoviedb.org/).
    2. Create an account or log in if you already have one.
    3. Navigate to the [API section](https://www.themoviedb.org/settings/api).
    4. Click on "Create" to generate a new API key. You will be provided with a key to access the API.

### 4. Set Up Environment Variables

    1. Create a `.env` file inside the root of the project (if it does not exist already).
    2. Add your TMDB API key to the `.env` file:

```bash
NUXT_TMDB_API_KEY=your_tmdb_api_key
```

Replace `your_tmdb_api_key` with the API key you obtained in the previous step.

### 5. Run the Development Server

Start the development server:

```bash
npm run dev
```

This will launch the app on [http://localhost:3000](http://localhost:3000).

## Features

- Responsive UI inspired by Netflix.
- Movie data fetched from the TMDB API.
- Dark theme with glassmorphism effect.
- Search Functionality added.
- Loading trailers for the movie in details page.
- Fully mobile-first design.

