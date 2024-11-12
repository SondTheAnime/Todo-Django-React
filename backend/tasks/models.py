from django.db import models
from django.conf import settings
from categories.models import Category
from django.utils import timezone
from django.core.validators import FileExtensionValidator

# Create your models here.


class Task(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pendente"),
        ("in_progress", "Em Andamento"),
        ("completed", "Concluída"),
    ]

    PRIORITY_CHOICES = [
        (1, "Baixa"),
        (2, "Média"),
        (3, "Alta"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        verbose_name="Usuário",
        related_name="tasks",
    )
    title = models.CharField("Título", max_length=200)
    description = models.TextField("Descrição", blank=True)
    status = models.CharField(
        "Status", max_length=20, choices=STATUS_CHOICES, default="pending"
    )
    priority = models.IntegerField("Prioridade", choices=PRIORITY_CHOICES, default=1)
    created_at = models.DateTimeField("Criado em", auto_now_add=True)
    due_date = models.DateTimeField("Data de Vencimento", null=True, blank=True)
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name="Categoria",
        related_name="tasks",
    )
    is_overdue = models.BooleanField("Vencida", default=False)
    attachment = models.FileField(
        "Anexos",
        upload_to="task_attachments/%Y/%m/%d/",
        null=True,
        blank=True,
        max_length=255,
        validators=[
            FileExtensionValidator(
                allowed_extensions=["pdf", "doc", "docx", "txt", "jpg", "jpeg", "png"]
            )
        ],
    )

    class Meta:
        verbose_name = "Tarefa"
        verbose_name_plural = "Tarefas"
        ordering = ["-created_at"]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        # Atualiza is_overdue automaticamente
        if self.due_date and self.status != "completed":
            self.is_overdue = self.due_date < timezone.now()
        else:
            self.is_overdue = False
        super().save(*args, **kwargs)
