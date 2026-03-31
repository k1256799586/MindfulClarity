export function jsonOk<T>(data: T) {
  return {
    status: 200,
    body: { data },
  };
}

export function jsonCreated<T>(data: T) {
  return {
    status: 201,
    body: { data },
  };
}

export function jsonError(code: string, message: string, status = 400) {
  return {
    status,
    body: {
      error: {
        code,
        message,
      },
    },
  };
}
