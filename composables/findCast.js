export const findMovieCast = () => {
    const config = useRuntimeConfig();
  
    // Fetch cast for a specific movie with the given ID
    const fetchMovieCast = async (movieId) => {
      if (!movieId) {
        console.error("Movie ID is required.");
        return [];
      }
  
      try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${config.public.tmdbApiKey}&language=en-US`);
        const data = await res.json();
        return data.cast.slice(0, 10).map(member => member.name); // Return only the names of the top 10 cast members
      } catch (error) {
        console.error(`Error fetching cast for movie ${movieId}:`, error);
        return [];
      }
    };
  
    return { fetchMovieCast };
  };
  