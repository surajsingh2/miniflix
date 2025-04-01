export default () => {
    const config = useRuntimeConfig();
  
    return (path, size = "w500") => {
      if (!path) return "/poster-notfound.png"; // Fallback image
      return `${config.public.tmdbImageBase}${size}${path}`;
    };
  };
  