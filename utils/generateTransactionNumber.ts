export const generateTransactionNumber = () => {
    const timestamp = Date.now();
    return `TRX-${timestamp}`;
  };