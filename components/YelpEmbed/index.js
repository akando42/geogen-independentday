import { useEffect } from "react";

export default function YelpEmbed({ businessId }) {

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.yelp.com/embed/widgets.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <span
      className="yelp-widget"
      data-widget-type="biz-badge"
      data-biz-id={businessId}
    ></span>
  );
}