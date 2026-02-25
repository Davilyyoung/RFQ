export const createRFQ = async (data) => {
    console.log("Mock submit payload:", data);

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                rfqNumber: "RFQ-2026-" + Math.floor(Math.random() * 1000)
            });
        }, 1500);
    });
};