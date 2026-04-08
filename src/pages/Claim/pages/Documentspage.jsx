import Button from "../../../component/Button"; // adjust path as needed
import { T } from "../tokens";

export default function DocumentsPage({ navigate }) {
  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "100px 24px", textAlign: "center" }}>
      <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24 }}>Document Center</h2>
      <Button
        text="← Back to Home"
        onClick={() => navigate("home")}
        bgcolor="transparent"
        color={T.muted}
        padding="9px 18px"
        fontSize="13px"
      />
    </div>
  );
}