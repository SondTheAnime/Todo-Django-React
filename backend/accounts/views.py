from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.middleware.csrf import get_token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
import logging
from rest_framework_simplejwt.tokens import RefreshToken

logger = logging.getLogger(__name__)

# Create your views here.


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get("username")
    password = request.data.get("password")

    logger.info(f"Tentativa de login - Email: {email}")

    if not email or not password:
        logger.warning("Tentativa de login sem credenciais completas")
        return Response(
            {"detail": "Por favor, forneça email e senha"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = authenticate(request, email=email, password=password)

    if user is not None:
        login(request, user)
        refresh = RefreshToken.for_user(user)
        logger.info(f"Login bem-sucedido para usuário: {email}")
        return Response(
            {
                "detail": "Login realizado com sucesso",
                "user": {"id": user.id, "username": user.username, "email": user.email},
                "tokens": {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
            }
        )

    logger.warning(f"Falha na autenticação para usuário: {email}")
    return Response(
        {"detail": "Credenciais inválidas"}, status=status.HTTP_401_UNAUTHORIZED
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logout(request)
    return Response({"detail": "Logout realizado com sucesso"})


@api_view(["GET"])
@permission_classes([AllowAny])
def get_csrf_token(request):
    return JsonResponse({"csrfToken": get_token(request)})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def check_auth(request):
    return Response(
        {
            "isAuthenticated": True,
            "user": {
                "id": request.user.id,
                "username": request.user.username,
                "email": request.user.email,
            },
        }
    )
