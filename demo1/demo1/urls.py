
from django.contrib import admin
from django.urls import path
from . import views,word

urlpatterns = [
    path('admin/', admin.site.urls),
    path('views/', views.process_image,name='process_image'),
    path('word/', word.process_image,name='process_image'),
]
