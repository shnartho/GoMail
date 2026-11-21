import { ImageResponse } from "next/og";

export const alt = "Go Mail by GoGentik. Email, reimagined for business.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "#f6f9ff",
        padding: "70px 85px",
        color: "#192236",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 15,
          fontSize: 29,
          fontWeight: 700,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 48,
            height: 48,
            background: "#2463eb",
            color: "white",
            borderRadius: 10,
            fontSize: 31,
          }}
        >
          G
        </div>
        Go Mail
        <span
          style={{
            fontSize: 16,
            fontWeight: 400,
            color: "#627086",
            marginLeft: 9,
          }}
        >
          by GoGentik
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: 55,
          fontSize: 70,
          fontWeight: 700,
          lineHeight: 1.15,
        }}
      >
        <span>Email, reimagined</span>
        <span style={{ color: "#2463eb" }}>for business.</span>
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 23,
          color: "#627086",
          marginTop: 26,
        }}
      >
        Your email stays where it is. Everything gets better.
      </div>
      <div
        style={{
          display: "flex",
          gap: 32,
          borderTop: "1px solid #dce5f3",
          paddingTop: 25,
          marginTop: 48,
          fontSize: 16,
          color: "#416598",
        }}
      >
        <span>Organized conversations</span>
        <span>Clearer security signals</span>
        <span>More connected teams</span>
      </div>
    </div>,
    size,
  );
}
