from rest_framework import serializers
from .models import Task
from categories.serializers import CategorySerializer
from django.utils import timezone


class TaskSerializer(serializers.ModelSerializer):
    category_details = CategorySerializer(source="category", read_only=True)
    is_overdue = serializers.BooleanField(read_only=True)

    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "description",
            "status",
            "priority",
            "created_at",
            "due_date",
            "category",
            "category_details",
            "is_overdue",
            "attachment",
        ]
        read_only_fields = ["created_at", "is_overdue"]

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Atualiza is_overdue no momento da serialização
        if instance.due_date and instance.status != "completed":
            data["is_overdue"] = instance.due_date < timezone.now()
        else:
            data["is_overdue"] = False
        return data
