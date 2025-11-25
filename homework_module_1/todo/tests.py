from django.test import TestCase, Client
from django.urls import reverse
from .models import Todo

class TodoTests(TestCase):
    def setUp(self):
        # Creamos una tarea de prueba antes de cada test
        self.todo = Todo.objects.create(title="Tarea de prueba")
        self.client = Client()

    def test_model_content(self):
        # Verificamos que se guardó correctamente en la base de datos
        self.assertEqual(self.todo.title, "Tarea de prueba")
        self.assertFalse(self.todo.is_resolved)

    def test_homepage(self):
        # Verificamos que la página de inicio carga bien
        response = self.client.get(reverse('index'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Tarea de prueba")

    def test_create_todo(self):
        # Verificamos la creación de tarea
        response = self.client.post(reverse('add_todo'), {
            'title': 'Nueva tarea desde test',
            'due_date': '2025-12-31'
        })
        self.assertEqual(response.status_code, 302) 
        self.assertEqual(Todo.objects.count(), 2)
