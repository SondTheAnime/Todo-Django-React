import json
import logging

logger = logging.getLogger(__name__)


class APILoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Log da requisição
        if request.path.startswith("/api/"):
            body = None
            if request.body:
                try:
                    body = json.loads(request.body)
                except json.JSONDecodeError:
                    body = request.body.decode("utf-8")

            logger.info(
                f"""
            ===== Request =====
            Path: {request.path}
            Method: {request.method}
            Body: {body}
            Headers: {dict(request.headers)}
            """
            )

        response = self.get_response(request)

        # Log da resposta
        if request.path.startswith("/api/"):
            try:
                response_body = None
                if hasattr(response, "content"):
                    try:
                        response_body = json.loads(response.content)
                    except json.JSONDecodeError:
                        response_body = response.content.decode("utf-8")

                logger.info(
                    f"""
                ===== Response =====
                Status: {response.status_code}
                Body: {response_body}
                Headers: {dict(response.headers)}
                """
                )
            except Exception as e:
                logger.error(f"Erro ao logar resposta: {e}")

        return response
