from ninja import Router
from typing import List
from .schemas import TaskIn, TaskOut
from .models import Task
from django.shortcuts import get_object_or_404
from core.api import auth

router = Router()


@router.get("/", response=List[TaskOut], auth=auth)
def list_tasks(request):
    return Task.objects.filter(user_id=request.auth)


@router.post("/", response=TaskOut, auth=auth)
def create_task(request, payload: TaskIn):
    task = Task.objects.create(user_id=request.auth, **payload.dict())
    return task


@router.get("/{task_id}", response=TaskOut, auth=auth)
def get_task(request, task_id: int):
    return get_object_or_404(Task, id=task_id, user_id=request.auth)


@router.put("/{task_id}", response=TaskOut, auth=auth)
def update_task(request, task_id: int, payload: TaskIn):
    task = get_object_or_404(Task, id=task_id, user_id=request.auth)
    for attr, value in payload.dict().items():
        setattr(task, attr, value)
    task.save()
    return task


@router.delete("/{task_id}", auth=auth)
def delete_task(request, task_id: int):
    task = get_object_or_404(Task, id=task_id, user_id=request.auth)
    task.delete()
    return {"success": True}
