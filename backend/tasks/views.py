from django.shortcuts import render
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from .models import Task
from .serializers import TaskSerializer
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework import status
from django.conf import settings
from rest_framework.response import Response
from django.db.models import Count, Q
from rest_framework.decorators import api_view, permission_classes, action
from django.utils import timezone
from django.utils.dateparse import parse_datetime

# Create your views here.


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'due_date', 'priority']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = Task.objects.filter(user=self.request.user)
        
        # Filtro por status
        status = self.request.query_params.get('status', None)
        if status:
            queryset = queryset.filter(status=status)
            
        # Filtro por prioridade
        priority = self.request.query_params.get('priority', None)
        if priority:
            queryset = queryset.filter(priority=priority)
            
        # Filtro por categoria
        category = self.request.query_params.get('category', None)
        if category:
            if category == 'none':
                queryset = queryset.filter(category__isnull=True)
            else:
                queryset = queryset.filter(category=category)
                
        # Busca por texto
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | 
                Q(description__icontains=search)
            )
            
        return queryset

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

    @action(detail=True, methods=['patch'])
    def status(self, request, pk=None):
        task = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in dict(Task.STATUS_CHOICES):
            return Response(
                {'error': 'Status inválido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        task.status = new_status
        task.save()
        serializer = self.get_serializer(task)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'])
    def due_date(self, request, pk=None):
        task = self.get_object()
        new_date = request.data.get('due_date')
        
        try:
            parsed_date = parse_datetime(new_date)
            if not parsed_date:
                raise ValueError("Data inválida")
                
            task.due_date = parsed_date
            task.save()
            serializer = self.get_serializer(task)
            return Response(serializer.data)
            
        except (ValueError, TypeError):
            return Response(
                {'error': 'Formato de data inválido'},
                status=status.HTTP_400_BAD_REQUEST
            )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    tasks = Task.objects.filter(user=request.user)
    
    # Identificar tarefas atrasadas
    now = timezone.now()
    overdue_tasks = tasks.filter(
        due_date__lt=now,
        status__in=['pending', 'in_progress']
    )
    
    # Distribuição de status incluindo atrasadas
    pending_count = tasks.filter(status='pending').exclude(id__in=overdue_tasks).count()
    in_progress_count = tasks.filter(status='in_progress').exclude(id__in=overdue_tasks).count()
    completed_count = tasks.filter(status='completed').count()
    overdue_count = overdue_tasks.count()
    
    status_distribution = [
        {'status': 'Pendentes', 'count': pending_count},
        {'status': 'Em Andamento', 'count': in_progress_count},
        {'status': 'Concluídas', 'count': completed_count},
        {'status': 'Atrasadas', 'count': overdue_count}
    ]
    
    category_distribution = tasks.values(
        'category__name',
        'category__color'
    ).annotate(count=Count('id')).exclude(category__isnull=True)
    
    return Response({
        'status_distribution': status_distribution,
        'category_distribution': category_distribution,
        'overdue_count': overdue_count,
        'total_tasks': tasks.count(),
        'completed_tasks': completed_count,
        'pending_tasks': pending_count
    })
