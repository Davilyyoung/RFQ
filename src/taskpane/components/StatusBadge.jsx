import * as React from "react";
export default function StatusBadge({ status }) {
    return (
        <div style={{
            background: "#e3f2fd",
            padding: 8,
            borderRadius: 6,
            marginBottom: 16
        }}>
            Status: {status}
        </div>
    );
}