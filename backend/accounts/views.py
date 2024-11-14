from django.contrib.auth import authenticate, login, logout, get_user_model
from django.http import JsonResponse
from django.middleware.csrf import get_token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
import logging
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

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
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        # Adiciona claims personalizados ao token
        refresh["username"] = user.username
        refresh["email"] = user.email

        logger.info(f"Login bem-sucedido para usuário: {email}")
        return Response(
            {
                "detail": "Login realizado com sucesso",
                "user": {"id": user.id, "username": user.username, "email": user.email},
                "tokens": {
                    "access": access_token,
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
    token = get_token(request)
    response = JsonResponse({"csrfToken": token})
    response["X-CSRFToken"] = token
    return response


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


@api_view(["POST"])
@permission_classes([AllowAny])
def register_view(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")

    if not all([username, email, password]):
        return Response(
            {"detail": "Todos os campos são obrigatórios"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        User = get_user_model()
        if User.objects.filter(email=email).exists():
            return Response(
                {"detail": "Este email já está em uso"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        logger.info(f"Novo usuário registrado: {email}")
        return Response(
            {
                "detail": "Conta criada com sucesso",
                "user": {"id": user.id, "username": user.username, "email": user.email},
                "tokens": {
                    "access": access_token,
                    "refresh": str(refresh),
                },
            }
        )
    except Exception as e:
        logger.error(f"Erro ao registrar usuário: {str(e)}")
        return Response(
            {"detail": "Erro ao criar conta"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["POST"])
@permission_classes([AllowAny])
def reset_password_request(request):
    email = request.data.get("email")
    
    if not email:
        return Response(
            {"detail": "Email é obrigatório"},
            status=status.HTTP_400_BAD_REQUEST
        )
        
    User = get_user_model()
    try:
        user = User.objects.get(email=email)
        # Gerar token único
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        
        # Aqui você implementaria o envio do email com o link de reset
        # Por enquanto, apenas retornamos sucesso
        logger.info(f"Solicitação de reset de senha para: {email}")
        return Response({"detail": "Instruções enviadas para seu email"})
        
    except User.DoesNotExist:
        return Response(
            {"detail": "Email não encontrado"},
            status=status.HTTP_404_NOT_FOUND
        )
