export const findGenres = () => {
  const config = useRuntimeConfig();
  const genres = ref({});

  // Fetch genres and cache them
  const fetchGenres = async () => {
    if (Object.keys(genres.value).length > 0) return; // Use cached genres

    try {
      const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${config.public.tmdbApiKey}&language=en-US`);
      const data = await res.json();
      genres.value = data.genres.reduce((acc, genre) => {
        acc[genre.id] = genre.name;
        return acc;
      }, {});
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  // Convert genre IDs to names
  const getGenreNames = async (genreIds) => {
    await fetchGenres();
    return genreIds.map(id => genres.value[id] || "Unknown");
  };

  return { getGenreNames };
};
