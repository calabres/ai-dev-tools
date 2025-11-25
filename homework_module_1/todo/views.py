from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.http import require_http_methods
from .models import Todo

def index(request):
    todos = Todo.objects.all().order_by('is_resolved', 'due_date') # Ordena: pendientes primero
    return render(request, 'home.html', {'todos': todos})

@require_http_methods(["POST"])
def add_todo(request):
    title = request.POST.get('title')
    due_date = request.POST.get('due_date')
    
    if title:
        Todo.objects.create(
            title=title,
            due_date=due_date if due_date else None
        )
    return redirect('index')

def toggle_todo(request, todo_id):
    todo = get_object_or_404(Todo, id=todo_id)
    todo.is_resolved = not todo.is_resolved
    todo.save()
    return redirect('index')

def delete_todo(request, todo_id):
    todo = get_object_or_404(Todo, id=todo_id)
    todo.delete()
    return redirect('index')

# Create your views here.
