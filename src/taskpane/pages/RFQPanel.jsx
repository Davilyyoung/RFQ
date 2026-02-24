import React, { useState, useEffect } from "react";
import { getMailContent } from "../services/mailService";
import { extractPartsFromMail } from "../utils/extractRFQ";
import PartsTable from "../components/PartsTable";
import Header from "../components/Header";
import StatusBadge from "../components/StatusBadge";
import ActionBar from "../components/ActionBar";

export default function RFQPanel() {
    const [mail, setMail] = useState(null);
    const [parts, setParts] = useState([]);
    const [status, setStatus] = useState("Loading");
    const [error, setError] = useState(null);
    const [isExtracting, setIsExtracting] = useState(false);

    useEffect(() => {
        async function loadMail() {
            try {
                const data = await getMailContent();
                setMail(data);
                setStatus("Mail Loaded");
            } catch (err) {
                setError(err.toString());
                setStatus("Error");
            }
        }

        loadMail();
    }, []);

    const handleExtract = async () => {
        if (!mail || isExtracting) return;

        try {
            setIsExtracting(true);
            setStatus("AI Analyzing...");
            setParts([]);

            const result = await extractPartsFromMail(mail.body);

            console.log("extractPartsFromMail:", result);

            setParts(result.items || result);
            setStatus("Extraction Complete");
        } catch (error) {
            console.error("Extraction failed:", error);
            setStatus("Extraction Failed");
        } finally {
            setIsExtracting(false);
        }
    };

    return (
        <div style={styles.container}>
            <Header />

            <StatusBadge status={status} />

            {error && <div style={styles.error}>{error}</div>}

            {mail && (
                <>
                    <div style={styles.mailCard}>
                        <h4>Data mapped from current email</h4>
                        <div>
                            <strong>Email Title:</strong> {mail.subject}
                        </div>
                    </div>

                    {/* Loading Animation */}
                    {isExtracting && (
                        <div style={styles.loadingBox}>
                            <div style={styles.spinner}></div>
                            <div style={{ marginTop: 10 }}>
                                AI is analyzing the email...
                            </div>
                        </div>
                    )}

                    {/* 结果表格 */}
                    {parts.length > 0 && !isExtracting && (
                        <PartsTable items={parts} />
                    )}

                    <ActionBar
                        onExtract={handleExtract}
                        itemCount={parts.length}
                        disabled={isExtracting}
                    />
                </>
            )}
        </div>
    );
}

const styles = {
    container: {
        padding: 20,
        fontFamily: "Segoe UI",
        background: "#f4f6f9",
        minHeight: "100vh"
    },
    mailCard: {
        background: "#e8f5e9",
        padding: 16,
        borderRadius: 10,
        marginBottom: 16,
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
    },
    error: {
        color: "red",
        marginBottom: 10
    },
    loadingBox: {
        background: "#ffffff",
        padding: 20,
        borderRadius: 10,
        textAlign: "center",
        marginBottom: 16,
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
    },
    spinner: {
        width: 40,
        height: 40,
        border: "4px solid #ddd",
        borderTop: "4px solid #0078d4",
        borderRadius: "50%",
        margin: "0 auto",
        animation: "spin 1s linear infinite"
    }
};