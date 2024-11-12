from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Task
from .serializers import TaskSerializer
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework import status
from django.conf import settings
from rest_framework.response import Response

# Create your views here.


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        attachment = request.FILES.get("attachment")
        if attachment and attachment.size > settings.MAX_UPLOAD_SIZE:
            return Response(
                {"error": "O arquivo não pode ser maior que 5MB"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return super().create(request, *args, **kwargs)
