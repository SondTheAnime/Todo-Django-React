from rest_framework import serializers
from .models import Task
from categories.serializers import CategorySerializer


class TaskSerializer(serializers.ModelSerializer):
    category_details = CategorySerializer(source="category", read_only=True)

    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "description",
            "status",
            "priority",
            "created_at",
            "category",
            "category_details",
        ]
        read_only_fields = ["created_at"]

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)
