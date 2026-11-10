# Formulario de tipo FormTemplate #

1- imports [FormsModule]

2- Maquetar en el HTML con <form>

<form action="" class="card shadow m-3 p-5">
...
</form>

3- Dentro de <form ...> añadir #nombreForm="ngform">

<form action="" class="card shadow m-3 p-5" #miFormulario="ngForm">
...
</form>

4- Crear evento de tipo submit con "(ngSubmit)"

<form action="" class="card shadow m-3 p-5" #miFormulario="ngForm" (ngSubmit)="getDataForm(miFormulario)">
...
</form>

5- Todos los campos del formulario deben llevar un name="..." y un atributo ngModel

