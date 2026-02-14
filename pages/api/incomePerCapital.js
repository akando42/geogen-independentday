import axios from "axios"

export default async (req, res) => {
  let country = req.query.country;

  const url = `https://api.tradingeconomics.com/country/${country}?c=a933c65b0ee24a1:xr7m8f44pmduxfy&f=json`
  await axios
    .get(url)
    .then(response => {
      let data = response.data
      console.log(data)
      res.status(200).json({
        data: data, 
        message: "Income Per Capital data"
      })
    })
    .catch(({ err }) => {
      res.status(400).json({ err })
    })
}


// curl "https://api.tradingeconomics.com/country/Vietnam/indicator/NY.GDP.PCAP.CD?c=blwvmxl5x1rk8qk:jodtirdtxtxvyld"