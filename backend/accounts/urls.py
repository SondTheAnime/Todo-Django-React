from django.urls import path
from . import views

urlpatterns = [
    path("login/", views.login_view, name="login"),
    path("logout/", views.logout_view, name="logout"),
    path("check/", views.check_auth, name="check_auth"),
    path("csrf/", views.get_csrf_token, name="get_csrf_token"),
]
