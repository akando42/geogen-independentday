async function getCityImage(city) {
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(city)}&orientation=landscape&per_page=1`,
    {
      headers: {
        Authorization: `Client-ID gsCdA0sZpWkc5lZu3OHe2lBOc-dd5M55CMQXKRBPbTY`
      }
    }
  );

  const data = await res.json();
  return data.results[0]?.urls?.regular;
}

export default async (req, res) => {
  let city = req.query.city
  const imageURL = await getCityImage(city);

  res.status(200).json({
    imageURL: imageURL,
    message: `https://unsplash.com/ Image for ${city}`
  })
}

