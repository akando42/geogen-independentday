import { useEffect, useRef } from "react";

export default function InstagramEmbed({ url, scale = 0.6 }) {
  const embedRef = useRef(null);

  useEffect(() => {
    if (!window.instgrm) {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => window.instgrm?.Embeds.process();
    } else {
      window.instgrm.Embeds.process();
    }
  }, [url]);

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        width: `${540 * scale}px`,
        margin: `0 10px`
      }}
    >
      <blockquote
        ref={embedRef}
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{ width: "540px" }}
      />
    </div>
  );
}