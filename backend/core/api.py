from ninja import NinjaAPI
from ninja.security import HttpBearer
from datetime import datetime, timedelta
import jwt
from django.conf import settings

api = NinjaAPI(title="Task Manager API", version="1.0.0")


class AuthBearer(HttpBearer):
    def authenticate(self, request, token):
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            return payload.get("user_id")
        except:
            return None


auth = AuthBearer()
