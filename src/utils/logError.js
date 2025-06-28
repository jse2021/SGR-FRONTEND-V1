export const logFrontendError = async (error) => {
  try {
    await fetch("/api/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: error.message || error.toString(),
        stack: error.stack || null,
        origin: "FRONTEND",
        timestamp: new Date(),
      }),
    });
  } catch (e) {
    // En caso de que falle el logging
    console.warn("No se pudo enviar el log al backend:", e);
  }
};
