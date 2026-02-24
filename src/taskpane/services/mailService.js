export function getMailContent() {
    return new Promise((resolve, reject) => {
        Office.onReady(() => {
            const item = Office.context.mailbox.item;

            if (!item) {
                reject("没有邮件对象");
                return;
            }

            item.body.getAsync(
                Office.CoercionType.Text,
                (result) => {
                    if (result.status === Office.AsyncResultStatus.Succeeded) {
                        resolve({
                            subject: item.subject,
                            body: result.value,
                        });
                    } else {
                        reject(result.error.message);
                    }
                }
            );
        });
    });
}