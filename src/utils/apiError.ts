
/**
 * Extracts a user-friendly error message from
 * an Axios/FastAPI error response.
 *
 * This function handles:
 *
 * 1. Simple FastAPI errors:
 *    { detail: "Invalid email or password" }
 *
 * 2. FastAPI validation errors:
 *    {
 *      detail: [
 *        {
 *          loc: ["body", "email"],
 *          msg: "Input should be a valid email"
 *        }
 *      ]
 *    }
 *
 * 3. Unknown errors
 *
 * 4. Network/server errors without a response
 */

export const getApiErrorMessage = (
  error: any,
  fallbackMessage: string
 ): string => {
  // =========================================
  // BACKEND RESPONSE
  // =========================================

  const responseData = error?.response?.data;

  // =========================================
  // FASTAPI DETAIL
  // =========================================

  const detail = responseData?.detail;

  // =========================================
  // CASE 1:
  // detail is already a normal string
  // =========================================

  if (typeof detail === "string") {
    return detail;
  }

  // =========================================
  // CASE 2:
  // FastAPI validation error array
  // =========================================

  if (Array.isArray(detail)) {
    const messages = detail
      .map((item: any) => item?.msg)
      .filter(Boolean);

    if (messages.length > 0) {
      return messages.join(" ");
    }
  }

  // =========================================
  // CASE 3:
  // Backend returned a message property
  // =========================================

  if (
    typeof responseData?.message === "string"
  ) {
    return responseData.message;
  }

  // =========================================
  // CASE 4:
  // Network error
  // =========================================

  if (
    error?.request &&
    !error?.response
  ) {
    return "Unable to connect to the server. Please check your connection and try again.";
  }

  // =========================================
  // CASE 5:
  // UNKNOWN ERROR
  // =========================================

  return fallbackMessage;
};

