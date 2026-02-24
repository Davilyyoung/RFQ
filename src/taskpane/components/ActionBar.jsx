import * as React from "react";
export default function ActionBar({ onExtract, itemCount }) {
    return (
        <div>
            <button
                onClick={onExtract}
                style={{
                    background: "#1976d2",
                    color: "#fff",
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: 8,
                    cursor: "pointer",
                    width: "100%"
                }}
            >
                {itemCount > 0
                    ? "Review & Submit"
                    : "Extract RFQ"}
            </button>
        </div>
    );
}