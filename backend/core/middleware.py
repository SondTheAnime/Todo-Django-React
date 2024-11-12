import json
import logging
from django.http import HttpResponse

logger = logging.getLogger(__name__)


class RequestLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Log da requisição
        content_type = request.headers.get("Content-Type", "")

        # Log básico da requisição
        logger.info(
            f"\n===== Request =====\n"
            f"Path: {request.path}\n"
            f"Method: {request.method}\n"
            f"Content-Type: {content_type}\n"
        )

        # Log do corpo da requisição apenas se não for multipart
        if content_type and not content_type.startswith("multipart/form-data"):
            try:
                if request.body:
                    body = json.loads(request.body)
                    logger.info(f"Body: {body}\n")
            except json.JSONDecodeError:
                logger.warning("Corpo da requisição não é JSON válido")
            except UnicodeDecodeError:
                logger.warning(
                    "Corpo da requisição não pode ser decodificado como UTF-8"
                )

        response = self.get_response(request)

        # Log da resposta
        logger.info(
            f"\n===== Response =====\n"
            f"Status: {response.status_code}\n"
            f"Body: {self._get_response_body(response)}\n"
            f"Headers: {dict(response.headers)}\n"
        )

        return response

    def _get_response_body(self, response):
        if hasattr(response, "data"):
            return response.data
        if isinstance(response, HttpResponse):
            try:
                return response.content.decode("utf-8")
            except UnicodeDecodeError:
                return "[Conteúdo binário]"
        return "Corpo da resposta não disponível"
