import * as React from "react";
export default function PartsTable({ items }) {
    return (
        <div style={{
            background: "#fff",
            borderRadius: 10,
            padding: 16,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            marginBottom: 16
        }}>
            <h4>Extractions from the mail</h4>

            <table style={{ width: "100%" }}>
                <thead>
                <tr>
                    <th>Part Number</th>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Cond</th>
                </tr>
                </thead>
                <tbody>
                {items.map((item, index) => (
                    <tr key={index}>
                        <td>{item.partNumber}</td>
                        <td>{item.description}</td>
                        <td>{item.qty}</td>
                        <td>{item.condition || "-"}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div style={{ marginTop: 10 }}>
                Items Detected: {items.length}
            </div>
        </div>
    );
}