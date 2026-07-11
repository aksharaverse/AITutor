class ApiError(Exception):
    """Raised anywhere in a request; rendered as the single error envelope."""

    def __init__(self, status: int, code: str, message: str):
        self.status = status
        self.code = code
        self.message = message
        super().__init__(message)
